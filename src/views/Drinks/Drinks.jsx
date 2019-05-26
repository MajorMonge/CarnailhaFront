import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import InfoIcon from "@material-ui/icons/Info";
import TextField from "@material-ui/core/TextField";
import Snackbar from "components/Snackbar/Snackbar.jsx";

import Icon from "@material-ui/core/Icon";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import Service from "../../services/drinks";
import UploadService from "../../services/upload_image";

import constants from "../../services/constants";

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5,
  },
});

class TablePaginationActions extends React.Component {
  handleFirstPageButtonClick = event => {
    this.props.onChangePage(event, 0);
  };

  handleBackButtonClick = event => {
    this.props.onChangePage(event, this.props.page - 1);
  };

  handleNextButtonClick = event => {
    this.props.onChangePage(event, this.props.page + 1);
  };

  handleLastPageButtonClick = event => {
    this.props.onChangePage(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1),
    );
  };

  render() {
    const { classes, count, page, rowsPerPage, theme } = this.props;

    return (
      <div className={classes.root}>
        <IconButton
          onClick={this.handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="First Page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label="Previous Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Next Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Last Page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </div>
    );
  }
}



const TablePaginationActionsWrapped = withStyles(actionsStyles, { withTheme: true })(
  TablePaginationActions,
);

let counter = 0;
function createData(name, _id) {
  counter += 1;
  return { id: counter, name, _id };
}

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 500,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  },
  fabButton: {
    position: "fixed",
    bottom: "30px",
    right: "30px"
  },
  rootList: {
    width: "100%",
    // maxWidth: 360,
    backgroundColor: "white",
    position: "relative",
    overflow: "auto",
    maxHeight: 300
  },
  listSection: {
    backgroundColor: "inherit"
  },
  ul: {
    backgroundColor: "inherit",
    padding: 0
  }
});

class Drinks extends React.Component {
  state = {
    rows: [],
    page: 0,
    rowsPerPage: 5,
    drinks: [],
    id: undefined,
    _id: undefined,
    name: "",
    quantity: "",
    icon: "",

    action: 0, //0- listagem, 1- insert estado, 2- insert cidade, 3- insert promoter
    indexState: null,
    notification: "",
    color: "info",
    tc: false,
    edit: false
  };
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleChangeImg = e => {
    console.log(e.target.files[0]);

    this.setState({
      file: e.target.files[0],
      img: URL.createObjectURL(e.target.files[0])
    });
  };

  _load = async () => {
    // eslint-disable-next-line no-console
    const response = await Service.get();
    console.log(response.data);
    if (response.data.code === 200) {
      let ac = [];
      response.data.drinks.map(drink => {
        ac.push(createData(drink.name, drink._id));
      })
      this.setState({ rows: ac, drinks: response.data.drinks });
    } else {
      alert("Um erro ocorreu");
    }
  };
  _save = async () => {
    const { drinks, name, quantity, file, rows } = this.state;

    console.log(file);

    const uploadResponse = await UploadService.post(file);

    const data = {
      name: name,
      quantity: quantity,
      icon: uploadResponse.data.img
    };

    const response = await Service.post(data);

    let msg = "",
      types = "";
    if (response.data.code != 201) {
      console.log(response.data.errors);
      for (let x in response.data.errors) {
        msg += response.data.errors[x].msg + ", ";
      }
      types = "danger";
    } else {
      msg = "Cadastrado com sucesso!";
      types = "success";
      drinks.push(response.data.drink);
      rows.push(createData(response.data.drink.name, response.data.drink._id))
      this.setState({ drinks, rows });
    }
    this.setState({ action: 1 });
    this.showNotification("tc", msg, types);
    this.handleClearFields();
  };
  _update = async () => {
    const { drinks, rows, id, _id, name, quantity, path } = this.state;

    const data = {
      ...drinks[id],
      _id: _id,
      name: name,
      quantity: quantity,
      icon: path
    };

    const response = await Service.update(data);
    let msg = "",
      types = "";
    if (response.data.code != 200) {
      for (let x in response.data.errors) {
        msg += response.data.errors[x].msg + ", ";
      }
      types = "danger";
    } else {
      msg = "Alterado com sucesso!";
      types = "success";
      let acc = drinks;
      let r = rows;
      let count = id - 1;
      acc[count] = response.data.drink;
      r[count] = { id: id, name: acc[count].name, _id: acc[count]._id }
      this.setState({ drinks: acc, rows: r });
    }

    this.setState({ action: 0 });
    this.showNotification("tc", msg, types);
  };
  _delete = async () => {
    const { drinks, rows, id, _id } = this.state;
    const data = {
      _id: _id
    };

    const response = await Service.delete(data);
    let msg = "",
      types = "";
    if (response.data.code != 200) {
      for (let x in response.data.errors) {
        msg += response.data.errors[x].msg + ", ";
      }
      types = "danger";
    } else {
      msg = "Deletado com sucesso!";
      types = "success";
      let acc = drinks;
      let r = rows;
      let count = id - 1;
      acc.splice(count, 1);
      rows.splice(count, 1)
      this.setState({ drinks: acc, rows: r });
    }

    this.setState({ action: 0 });
    this.showNotification("tc", msg, types);
  };
  showNotification(place, notification, color) {
    console.log("MOSTRANDO NOTIFICAÇÃO");
    var x = [];
    x[place] = true;
    this.setState(x);
    this.setState({ notification, color });
    this.alertTimeout = setTimeout(
      function () {
        x[place] = false;
        this.setState(x);
      }.bind(this),
      6000
    );
  }
  handleChangePage = (event, page) => {
    this.setState({ page });
  };
  handleClearFields = () => {
    const name = "",
      quantity = "",
      icon = ""
    this.setState({ name, quantity, icon });
  };
  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };
  componentDidMount() {
    this._load();
  }
  renderSnackbar() {
    return (
      <GridItem xs={12} sm={12} md={4}>
        <Snackbar
          place="tc"
          color={this.state.color}
          icon={InfoIcon}
          message={this.state.notification}
          open={this.state.tc}
          closeNotification={() => this.setState({ tc: false })}
          close
        />
      </GridItem>
    );
  }
  renderFormDrinks() {
    // eslint-disable-next-line react/prop-types
    const { classes } = this.props;
    return (
      <GridContainer>
        {this.renderSnackbar()}
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>{(this.state.action == 1) ? `Nova Bebida` : `Editar Bebida`}</h4>
            </CardHeader>
            <CardBody>
              <GridItem xs={12} sm={12} md={12} style={{ marginTop: "23px" }}>
                <TextField
                  label="Nome da Bebida"
                  id="name"
                  value={this.state.name}
                  onChange={this.handleChange("name")}
                  fullWidth
                />
                <TextField
                  label="Quantidade de Bebida"
                  id="quantity"
                  value={this.state.quantity}
                  type="number"
                  onChange={this.handleChange("quantity")}
                  fullWidth
                />

                <input type="file" onChange={this.handleChangeImg} />

                <GridItem xs={12} sm={12} md={12} style={{ marginTop: "23px" }}>
                  <img src={this.state.icon} />
                </GridItem>

                <Button
                  size="small"
                  color="secondary"
                  aria-label="Add"
                  className={classes.button}
                  onClick={() => this.setState({ action: 0 })}
                >
                  Voltar
                </Button>
                <Button
                  size="small"
                  color="primary"
                  aria-label="Add"
                  className={classes.button}
                  onClick={() => {
                    (this.state.action == 1)
                      ? this._save()
                      : this._update();
                  }
                  }
                >
                  Salvar
                  </Button>

                {/* <TextField
                  id="state"
                  select
                  label="Estado"
                  // className={classes.textField}
                  value={this.state.state}
                  onChange={this.handleChange("state")}
                  SelectProps={{
                    native: true,
                    MenuProps: {
                      className: classes.menu
                    }
                  }}
                  fullWidth
                  helperText="Selecione o estado"
                  margin="normal"
                >
                  {this.state.states.map((option, index) => (
                    <option key={index} value={option.Nome}>
                      {option.Nome}
                    </option>
                  ))}
                </TextField> */}
              </GridItem>
            </CardBody>
            <CardFooter>
              <GridItem xs={12} sm={12} md={12}>
                <p>Bebidas já cadastradas:</p>
                <ul>
                  {this.state.drinks.map(name => (
                    // eslint-disable-next-line react/jsx-key
                    <li>{`${name.name}`}</li>
                  ))}
                </ul>
              </GridItem>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
  renderList() {
    const { classes } = this.props;
    const { rows, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    return (
      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            <TableBody>
              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>

                  <TableCell align="right">
                    <IconButton aria-label="Edit" onClick={() => {
                      let ac = this.state.drinks[row.id - 1];
                      console.log(row.id);
                      this.setState({
                        action: 2,
                        id: row.id,
                        _id: row._id,
                        name: ac.name,
                        quantity: ac.quantity,
                        icon: `http://localhost:5000/${ac.icon}`,
                        path: ac.icon
                      });
                      // this.handleClearFields();
                    }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton aria-label="Delete" onClick={() => {
                      console.log(row._id);
                      this.setState({
                        id: row.id,
                        _id: row._id
                      }, () => {
                        this._delete()
                      });
                    }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 48 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  colSpan={3}
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    native: true,
                  }}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActionsWrapped}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </Paper>
    );
  }
  render() {
    const { classes } = this.props;
    switch (this.state.action) {
      case 0:
        return (<GridItem xs={12} sm={12} md={12}>
          <Card>
            {this.renderSnackbar()}
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>
                Bebidas Cadastradas
                </h4>
              <p>
                Área de gerenciamento das bebidas do site. Você pode inserir
                uma nova bebida e editar as bebidas já existentes.
                </p>
              <Button
                onClick={() => {
                  this.setState({ action: 1 });
                  this.handleClearFields();
                }}
                style={{ alignItems: "center", justifyContent: "center" }}
                round
                color="success"
                className={classes.fabButton}
              >
                <AddIcon /> Nova Bebida
                </Button>
            </CardHeader>
            <CardBody>
              {this.renderList()}
            </CardBody>
          </Card>
        </GridItem>);
      case 1:
        return this.renderFormDrinks();
      case 2:
        return this.renderFormDrinks();
    }
  }
}

Drinks.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Drinks);
