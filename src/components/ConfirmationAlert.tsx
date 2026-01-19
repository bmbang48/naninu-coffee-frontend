interface Props{
    isConfirm: boolean;
    setIsConfirm: React.Dispatch<React.SetStateAction<boolean>>;
    isConfirmDelete: boolean;
    setIsConfirmDelete: React.Dispatch<React.SetStateAction<boolean>>;
}

const ConfirmationAlert = ({isConfirm,setIsConfirm,isConfirmDelete, setIsConfirmDelete}:Props) => {


    const handleCloseForm = () => {
        setIsConfirm(false);
    }
    const handleDelete  = ()=>{
        setIsConfirmDelete(true);
        setIsConfirm(false);
    }

    return (
        <div className="popup-confirmation">
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header" data-bs-theme="dark">
                    <h5 className="modal-title" id="confirmModalLabel">Konfirmasi</h5>
                    <p className="btn-x position-absolute top-0" onClick={handleCloseForm}>X</p>
                </div>
                <div className="modal-body">
                    Are you sure you want to delete this ?
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCloseForm}>Batal</button>
                    <button type="button" className="btn btn-danger" id="confirmDeleteBtn" onClick={handleDelete}>Ya, Hapus</button>
                </div>
                </div>
            </div>
        </div>
    );
}
export default ConfirmationAlert;