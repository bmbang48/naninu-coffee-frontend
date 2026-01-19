interface Props{
    message: string;
    subject: string;
    isSuccess: boolean;
    setIsSuccess: React.Dispatch<React.SetStateAction<boolean>>;
    handleCloseForm: ()=> void;
}
const NotificationAlert = ({message, subject, isSuccess, setIsSuccess, handleCloseForm}:Props)=>{
    const handleClose = () => {
        setIsSuccess(false);
        handleCloseForm();
    }
    return (
        isSuccess ? (
        <div className="popup-confirmation">
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header" data-bs-theme="dark">
                    <p className="btn-x position-absolute top-0" onClick={handleCloseForm}>X</p>
                </div>
                <div className="modal-body">
                    <h5 className="modal-title text-center text-white" id="confirmModalLabel">{subject}</h5>
                    {message}
                </div>
                <div className="modal-footer justify-content-center">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleClose}>Oke</button>
                </div>
                </div>
            </div>
        </div>
        )
        : (<p>Data gagal ditambahkan</p>)
    );
}

export default NotificationAlert;