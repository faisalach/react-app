import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const PopUpAlert = () => {
    
    const alertSuccess = (title) => {
        withReactContent(Swal).fire({
            title: title,
            icon: 'success'
        })
    }

    const alertError = (title) => {
        withReactContent(Swal).fire({
            title: title,
            icon: 'danger'
        })
    }

    const alertConfirm = (title,api) => {
        withReactContent(Swal).fire({
            title: title,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                api()
            }
        })
    }

    return {
        alertSuccess,
        alertError,
        alertConfirm
    }
};

export default PopUpAlert;