import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CancelIcon from '@mui/icons-material/Cancel';

import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/auth';

import './style.css';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 20,
    p: 4,
};

export default function ModalChamado({ conteudo }) {
    const { setShowItem } = useContext(AuthContext);
    const [open, setOpen] = useState(true);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setShowItem(false);
        setOpen(false);
    }
    return (
        <Modal open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            <Box sx={style}>
                <Typography variant="h5" component="h3" sx={{ m: 0, p: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    Detalhes do chamado
                </Typography>
                <Box sx={{ m: 0, p: "10px", display: "flex", alignItems: "left", justifyContent: "center", flexDirection: "column" }}>
                    <Typography variant="h6" component="span">
                        Cliente: <i>{conteudo.cliente}</i>
                    </Typography>

                    <Typography variant="h6" component="span">
                        Assunto: <i>{conteudo.assunto}</i>
                    </Typography>

                    <Typography variant="h6" component="span">
                        Cadastrado em: <i>{conteudo.createdFormated}</i>
                    </Typography>

                    <Typography variant="h6" component="span">
                        Status: <i style={{ color: "white", backgroundColor: conteudo.status === 'Aberto' ? '#5CB85C' : '#999' }}>{conteudo.status}</i>
                    </Typography>
                </Box>

                {conteudo.complemento !== '' && (
                    <>
                        <h3>Complemento</h3>
                        <p>{conteudo.complemento}</p>
                    </>
                )}

                <Button
                    onClick={handleClose}
                    sx={{
                        m: "5px",
                        p: "6px",
                        backgroundColor: "#d32f2f",
                        color: "white",
                        '&:hover': {
                            backgroundColor: "#b71c1c"
                        },
                    }}>
                    <CancelIcon size={23} color="white" />
                    Voltar
                </Button>
            </Box>
        </Modal>
    )
}