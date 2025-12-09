"use client"

import Form from "@/components/Form";

type Props = {
    onClose: () => void;
    gettype: any;
    getpromo: any;
};

export default function Modal({ onClose, gettype, getpromo }: Props) {

    return (
        <div className="modal fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
            <div 
                className="overlay w-full h-full bg-[#000000d6] absolute top-0 left-0" 
                onClick={onClose}
            ></div>
            <div className="modal-content bg-white p-6 rounded-lg z-10 max-w-lg lg:w-full relative overflow-auto max-h-[90vh] md:w-md sm:w-sm">
                <button
                    className="closeModal absolute top-2 right-2 text-2xl font-bold cursor-pointer hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center transition"
                    onClick={onClose}
                >
                    ✕
                </button>
                <Form promo={getpromo} type={gettype} onSuccess={onClose} />
            </div>
        </div>
    )
}