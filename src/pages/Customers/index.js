import Box from '@mui/material/Box';
import Header from "../../components/Header";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useState } from 'react';
import firebase from '../../services/firebaseConnection';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { toast } from 'react-toastify';

import './style.css';

export default function Customers() {
    const [nomeFantasia, setNomeFantasia] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [endereco, setEndereco] = useState('');

    async function handleAdd(e) {
        e.preventDefault();
        if (nomeFantasia !== '' && cnpj !== '' && endereco !== '') {
            await firebase.firestore().collection('customers')
                .add({
                    nomeFantasia: nomeFantasia,
                    cnpj: cnpj,
                    endereco: endereco
                })
                .then(() => {
                    setNomeFantasia('');
                    setCnpj('');
                    setEndereco('');
                    toast.info('Empresa cadastrada com sucesso!');
                })
                .catch((error) => {
                    console.log(error);
                    toast.error('Erro ao cadastrar empresa!');
                })
        } else {
            toast.error('Preencha todos os campos!');
        }
    }

    return (
        <Box className="container-customers">
            <Header nome="Clientes" />
            <Box component="form" className="box-customers" onSubmit={handleAdd}>
                <Box className="box-form-customers" >
                    <TextField
                        id="outlined-basic"
                        label="Nome da empresa"
                        value={nomeFantasia}
                        onChange={(e) => setNomeFantasia(e.target.value)}
                        sx={{ mb: "25px" }}
                    />

                    <TextField
                        id="outlined-basic"
                        label="CNPJ"
                        value={cnpj}
                        onChange={(e) => setCnpj(e.target.value)}
                        sx={{ mb: "25px" }}
                    />

                    <TextField
                        id="outlined-basic"
                        label="Endereço da empresa"
                        value={endereco}
                        onChange={(e) => setEndereco(e.target.value)}
                        sx={{ mb: "25px" }}
                    />

                    <Button type="submit" fullWidth variant="contained">
                        Registrar
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}