import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';

import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/auth';
import { toast } from 'react-toastify';
import { useHistory, useParams } from 'react-router-dom';

import firebase from '../../services/firebaseConnection';
import Header from '../../components/Header';

import './style.css';
import { TextField } from '@mui/material';

export default function Chamados() {
    const { id } = useParams();
    const history = useHistory();

    const [loadCustomers, setLoadCustomers] = useState(true);
    const [customers, setCustomers] = useState([]);
    const [customerSelected, setCustomerSelected] = useState(0);

    const [assunto, setAssunto] = useState('Suporte');
    const [status, setStatus] = useState('Aberto');
    const [complemento, setComplemento] = useState('');

    const [idCustomer, setIdCustomer] = useState(false);

    const { user } = useContext(AuthContext);

    useEffect(() => {
        async function loadCustomers() {
            await firebase.firestore().collection('customers')
                .get()
                .then((snapshot) => {
                    let lista = [];
                    snapshot.forEach((doc) => {
                        lista.push({
                            id: doc.id,
                            nomeFantasia: doc.data().nomeFantasia
                        })
                    })

                    if (lista.length === 0) {
                        console.log("Nenhuma empresa encontrada");
                        setLoadCustomers(false);
                        setCustomers([{ id: 1, nomeFantasia: '' }])
                        return;
                    }

                    setCustomers(lista);
                    setLoadCustomers(false);

                    if (id) {
                        loadId(lista);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    setLoadCustomers(false);
                    setCustomers([{ id: 1, nomeFantasia: '' }])
                })
        }

        async function loadId(lista) {
            await firebase.firestore().collection('chamados')
                .doc(id)
                .get()
                .then((snapshot) => {
                    //console.log(`${snapshot.data().assunto}`)
                    setAssunto(snapshot.data().assunto);
                    setStatus(snapshot.data().status);
                    setComplemento(snapshot.data().complemento);
                    let index = lista.findIndex(item => item.id === snapshot.data().clienteId);
    
                    setCustomerSelected(index);
                    setIdCustomer(true);
                })
                .catch((error) => {
                    console.log(error);
                    toast.error("Esse chamado não existe! Tente novamente!");
                    history.push('/dashboard');
                    setIdCustomer(false);
                })
        }

        loadCustomers();
    }, []);

    async function handleRegister(e) {
        e.preventDefault();

        if (idCustomer) {
            await firebase.firestore().collection('chamados')
                .doc(id)
                .update({
                    cliente: customers[customerSelected].nomeFantasia,
                    clienteId: customers[customerSelected].id,
                    assunto: assunto,
                    status: status,
                    complemento: complemento,
                    userId: user.uid
                })
                .then(() => {
                    setComplemento('');
                    setCustomerSelected(0);
                    history.push('/dashboard');
                    toast.success("Chamado editado com sucesso!");
                })
                .catch((error) => {
                    console.log(error);
                    toast.error("Ops! Erro ao editar chamado!");
                })
            return;
        }

        await firebase.firestore().collection('chamados')
            .add({
                created: new Date(),
                cliente: customers[customerSelected].nomeFantasia,
                clienteId: customers[customerSelected].id,
                assunto: assunto,
                status: status,
                complemento: complemento,
                userId: user.uid
            })
            .then(() => {
                toast.success("Chamado registrado com sucesso!");
                setComplemento('');
                setCustomerSelected(0);
            })
            .catch((error) => {
                console.log(error);
                toast.error("Ops! Erro ao registrar chamado!");
            })
    }

    function handleChangeSelect(e) {
        e.preventDefault();
        setAssunto(e.target.value)
    }

    function handleOptionChange(e) {
        e.preventDefault();
        setStatus(e.target.value)
    }

    function handleChangeCustomers(e) {
        e.preventDefault();
        setCustomerSelected(e.target.value);
    }

    return (
        <Box className="container-chamados">
            <Header nome="Chamados" />

            <Box component="form" className="box-chamados" onSubmit={handleRegister}>
                <Box className="box-form-chamados">
                    <FormControl className="form-chamados" sx={{ mb: "25px" }}>
                        <InputLabel id="demo-simple-select-label">Cliente</InputLabel>

                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={customerSelected}
                            label="Cliente"
                            onChange={handleChangeCustomers}
                        >
                            {customers.map((item, index) => {
                                return (
                                    <MenuItem key={item.id} value={index}>
                                        {item.nomeFantasia}
                                    </MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>

                    <FormControl className="form-chamados" sx={{ mb: "25px" }}>
                        <InputLabel id="demo-simple-select-label">Assunto</InputLabel>

                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={assunto}
                            label="Assunto"
                            onChange={handleChangeSelect}
                        >
                            <MenuItem value="Visita técnica">Visita técnica</MenuItem>
                            <MenuItem value="Financeiro">Financeiro</MenuItem>
                            <MenuItem value="Suporte">Suporte</MenuItem>
                            <MenuItem value="TI">TI</MenuItem>
                            <MenuItem value="RH">RH</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl component="fieldset" sx={{ mb: "25px" }} >
                        <label className="form-control" >Status</label>
                        <RadioGroup row >
                            <FormControlLabel
                                value="Aberto"
                                control={
                                    <Radio
                                        onChange={handleOptionChange}
                                        checked={status === 'Aberto'}
                                        sx={{
                                            color: "black", '&.Mui-checked': {
                                                color: "#00acc1",
                                            },
                                        }}
                                    />
                                }
                                label="Aberto"
                            />

                            <FormControlLabel
                                value="Progresso"
                                control={
                                    <Radio
                                        onChange={handleOptionChange}
                                        checked={status === 'Progresso'}
                                        sx={{
                                            color: "black", '&.Mui-checked': {
                                                color: "#00acc1",
                                            },
                                        }}
                                    />}
                                label="Em progresso"
                            />
                            <FormControlLabel
                                value="Atendido"
                                control={
                                    <Radio
                                        onChange={handleOptionChange}
                                        checked={status === 'Atendido'}
                                        sx={{
                                            color: "black", '&.Mui-checked': {
                                                color: "#00acc1",
                                            },
                                        }}
                                    />}
                                label="Atendido"
                            />
                        </RadioGroup>
                    </FormControl>

                    <TextField
                        id="outlined-multiline-flexible"
                        label="Complemento"
                        multiline
                        maxRows={5}
                        placeholder="Descreva seu problema (opcional)"
                        value={complemento}
                        onChange={(e) => setComplemento(e.target.value)}
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