import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Header from "../../components/Header";
import Button from '@mui/material/Button';

import { AuthContext } from '../../contexts/auth';
import { useContext, useState } from 'react';

import firebase from '../../services/firebaseConnection';

import './style.css';

export default function Profile() {
    const { user, signOut, setUser, storageUser } = useContext(AuthContext);

    const [nome, setNome] = useState(user && user.nome);
    const [email, setEmail] = useState(user && user.email);

    async function handleSave(e) {
        e.preventDefault();
        if (nome !== '') {
            await firebase.firestore().collection('users')
                .doc(user.uid)
                .update({
                    nome: nome
                })
                .then(() => {
                    let data = {
                        ...user,
                        nome: nome
                    };
                    setUser(data);
                    storageUser(data);
                })
                .catch((error) => {
                    alert(`${error}`)
                })
        }
    }

    return (
        <Box className="container-profile">
            <Header nome="Seu perfil" />
            <Box component="form" className="box-profile" onSubmit={handleSave}>
                <Box className="box-form" >
                    <TextField
                        id="outlined-basic"
                        label="Nome"
                        defaultValue={nome}
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        sx={{ mb: "25px" }}
                    />

                    <TextField
                        disabled
                        id="outlined-disabled"
                        label="E-mail"
                        defaultValue={email}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{ mb: "25px" }}
                    />

                    <Button type="submit" fullWidth variant="contained">
                        Salvar
                    </Button>
                </Box>
                <Box className="logout">
                    <Button variant="contained" onClick={() => signOut()}>
                        Sair
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}