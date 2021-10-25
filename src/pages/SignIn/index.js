import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';

import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/auth';
import { Link } from 'react-router-dom';

import './style.css';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signIn, loadingAuth } = useContext(AuthContext);

    function handleSubmit(e) {
        e.preventDefault();
        if (email !== '' && password !== '') {
            signIn(email, password);
        }
    }

    return (
        <Grid component="main" className="content">
            <Grid
                item
                xs={false}
                sm={4}
                md={12}
                sx={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1626797848752-612c86b61011?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=687&q=80)',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: (t) =>
                        t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />

            <Box className="container">
                <Avatar className="avatar">
                    <LockOutlinedIcon />
                </Avatar>

                <Typography component="h1" variant="h5">
                    SignIn
                </Typography>
                <Box component="form" onSubmit={handleSubmit} className="form-signIn" >
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Button type="submit" fullWidth variant="contained">
                        {loadingAuth ? 'Carregando...' : 'Acessar'}
                    </Button>
                </Box>

                <Grid sx={{p:"20px"}}>
                    <Link to="/">Já possui uma conta? Entre!</Link>
                </Grid>
            </Box>
        </Grid>

    )
}