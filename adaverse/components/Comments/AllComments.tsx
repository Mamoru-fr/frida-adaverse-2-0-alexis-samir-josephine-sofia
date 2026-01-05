'use client';

import {useEffect, useState} from "react";
import {Comments} from "@/content/interface";
import {CreateComment} from "@/components/Comments/CreateComment";
import {ModifyComment} from "@/components/Comments/ModifyComment";
import {CommentFormat} from "@/components/Comments/CommentFormat";

interface AllCommentsProps {
  refreshKey?: number;
  projectId: number;
  session: any;
}

export const AllComments = ({refreshKey = 0, projectId, session}: AllCommentsProps) => {
  const [comments, setComments] = useState<Comments[]>([]);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshComments = () => {
    setLoading(true);
    fetch(`/api/comments/project/${projectId}`, // TODO : Créer la route API
    ).then(res => res.json())
      .then(data => {
        setComments(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching comments:', error);
        setLoading(false);
      });
  }

  useEffect(() => {
    refreshComments();
  }, [refreshKey, projectId]);

  const handleEdit = (commentId: number) => {
    setEditingCommentId(commentId);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
  };

  const handleSaveEdit = (commentId: number, newContent: string) => {
    fetch(`/api/comments/${commentId}`, { // TODO : Créer la route API pour la modification d'un commentaire
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({content: newContent})
    }).then(res => {
        if (res.ok) {
          refreshComments();
          setEditingCommentId(null);
        } else {
          res.json().then(error => {
            alert(error.error || 'Failed to update comment');
          });
        }
      })
      .catch(error => {
        console.error('Error updating comment:', error);
        alert('Failed to update comment');
      });
  };

  const handleDeleteComment = (commentId: number) => {
    fetch(`/api/comments/${commentId}`, { // TODO : Créer la route API pour la suppression d'un commentaire
      method: 'DELETE',
    }).then(res => {
        if (res.ok) {
          refreshComments();
          setEditingCommentId(null);
        } else {
          res.json().then(error => {
            alert(error.error || 'Failed to delete comment');
          });
        }
      })
      .catch(error => {
        console.error('Error deleting comment:', error);
        alert('Failed to delete comment');
      });
  };

  return (
    <div className="max-w-6xl mx-auto mt-12 border-t border-gray-400/30 pt-8">
      <h3 className="text-2xl font-bold mb-6 text-[#f3d5d5]">
        Commentaires ({comments.length})
      </h3>

      {session?.user ? (
        <CreateComment projectId={projectId} refreshComments={refreshComments} />
      ) : (
        <p className="mb-6 text-gray-200 italic">
          Connectez-vous pour laisser un commentaire
        </p>
      )}

      {loading ? (
        <p className="text-gray-200">Chargement des commentaires...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-200 italic">
          Aucun commentaire pour le moment. Soyez le premier à commenter !
        </p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li key={comment.id}>
              {editingCommentId === comment.id ? (
                <ModifyComment
                  comment={comment}
                  onSave={(newContent) => handleSaveEdit(comment.id, newContent)}
                  onCancel={handleCancelEdit}
                  onDelete={() => handleDeleteComment(comment.id)}
                />
              ) : (
                <CommentFormat
                  comment={comment}
                  onEdit={() => handleEdit(comment.id)}
                  onDelete={() => handleDeleteComment(comment.id)}
                  session={session}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}