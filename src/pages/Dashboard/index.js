import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import VisibilityIcon from '@mui/icons-material/Visibility';


import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/auth';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

import ModalChamado from '../../components/Modal';
import Header from "../../components/Header";
import firebase from '../../services/firebaseConnection';

import './style.css';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#00bcd4',
        color: theme.palette.common.black,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 12,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));


function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0 }} className="table-footer">
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};


export default function Dashboard() {
    const { showItem, setShowItem, user } = useContext(AuthContext);

    const [chamados, setChamados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);
    const [detail, setDetail] = useState();
    const [clientId, setCLientId] = useState(user && user.uid);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    //const listRef = firebase.firestore().collection('chamados').orderBy('created', 'desc').equalTo(user.uid);

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - chamados.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        async function loadChamados() {
            await firebase.firestore().collection('chamados')
                .orderBy('created', 'desc')
                .get()
                .then((snapshot) => {
                    updateState(snapshot);
                })
                .catch((error) => {
                    console.log(error);
                    setLoadingMore(false);
                })
            setLoading(false);
        }

        loadChamados();

        return;
    }, [])

    async function updateState(snapshot) {
        const isCollectionEmpty = snapshot.size === 0;

        if (!isCollectionEmpty) {
            let lista = [];
            snapshot.forEach((doc) => {
                if(user.uid === doc.data().userId){
                    lista.push({
                        id: doc.id,
                        assunto: doc.data().assunto,
                        cliente: doc.data().cliente,
                        clienteId: doc.data().clienteId,
                        created: doc.data().created,
                        createdFormated: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
                        status: doc.data().status,
                        complemento: doc.data().complemento
                    })
                }
            })
            setChamados(chamados => [...chamados, ...lista]);
        }
        else {
            setIsEmpty(true);
        }
        setLoadingMore(false);
    }

    function teste(page, rowsPerPage) {
        console.log(chamados)
        let aux = chamados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
        console.log(aux)
        return aux;
    }

    function toggleSearch(item) {
        console.log(`${item}`)
        setShowItem(!showItem);
        setDetail(item);
    }

    return (
        <Box className="container">
            <Header nome="Dashboard" />
            <Box className="box">
                {chamados.length === 0 ? (
                    <div>
                        <span>Nenhum chamado registrado</span>

                        <Link to="/new" className="new">Novo chamado</Link>
                    </div>
                ) : (
                    <>
                        <Link to="/new" className="new">Novo chamado</Link>

                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 450 }} aria-label="simple table" className="table-container">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>Cliente</StyledTableCell>
                                        <StyledTableCell align="center">Assunto</StyledTableCell>
                                        <StyledTableCell align="center">Status</StyledTableCell>
                                        <StyledTableCell align="center">Cadastrado em</StyledTableCell>
                                        <StyledTableCell align="center">#</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(rowsPerPage > 0 ? teste(page, rowsPerPage) : chamados).map((item, index) => (
                                        <StyledTableRow key={item.id}>
                                            <StyledTableCell component="th" scope="row">{item.cliente}</StyledTableCell>
                                            <StyledTableCell align="center">{item.assunto}</StyledTableCell>
                                            <StyledTableCell align="center">{item.status}</StyledTableCell>
                                            <StyledTableCell align="center">{item.createdFormated}</StyledTableCell>
                                            <StyledTableCell
                                                align="center"
                                                sx={{
                                                    '@media screen and (max-width: 600px)': {
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        flexDirection: "column"
                                                    }
                                                }}>

                                                <Button
                                                    sx={{
                                                        width: 25,
                                                        backgroundColor: "#af52bf",
                                                        '&:hover': {
                                                            backgroundColor: "#6d1b7b"
                                                        },
                                                        minWidth: 20,
                                                        pt: 0,
                                                        pb: 0,
                                                        pr: 0,
                                                        pl: 0,
                                                        borderRadius: 1
                                                    }}>
                                                    <Link to={`new/${item.id}`} className="link-button">
                                                        <BorderColorIcon sx={{ width: "70%" }} />
                                                    </Link>
                                                </Button>

                                                <Button
                                                    sx={{
                                                        width: 25,
                                                        backgroundColor: "#6573c3",
                                                        '&:hover': { backgroundColor: "#2c387e" },
                                                        minWidth: 20,
                                                        pt: 0,
                                                        pb: 0,
                                                        pr: 0,
                                                        pl: 0,
                                                        ml: 1,
                                                        borderRadius: 1,
                                                        '@media screen and (max-width: 600px)': { ml: 0, mt: 1 }
                                                    }}
                                                    className="button-eye"
                                                    onClick={() => toggleSearch(item)}>
                                                    <VisibilityIcon sx={{ width: "70%", color: "white" }} />
                                                </Button>

                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                                    {emptyRows > 0 && (
                                        <TableRow style={{ height: 53 * emptyRows }}>
                                        </TableRow>
                                    )}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TablePagination
                                            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                            count={chamados.length}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            SelectProps={{
                                                inputProps: {
                                                    'aria-label': 'rows per page',
                                                },
                                                native: true,
                                            }}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                            ActionsComponent={TablePaginationActions}
                                        />
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>
                    </>
                )}

                {showItem && (
                    <ModalChamado conteudo={detail} />
                )}
            </Box>
        </Box >
    )
}