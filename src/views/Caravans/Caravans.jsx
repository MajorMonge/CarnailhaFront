import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
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
import InfoIcon from "@material-ui/icons/Info";
import TextField from "@material-ui/core/TextField";
import Snackbar from "components/Snackbar/Snackbar.jsx";

import Icon from "@material-ui/core/Icon";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";

import Service from "../../services/caravans";

import constants from "../../services/constants";

const styles = {
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
};

class Caravans extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      caravans: [],
      listStates: [],

      table: [],
      states: constants.estados,
      state: "SP",
      city: null,
      promoters: [{ name: "", img: "", wpp: "", email: "", face_link: "" }],
      activeStep: 0,
      countPromoters: 1,
      modalOpen: false,

      notification: "",
      color: "info",
      tc: false,
      edit: false
    };
  }

  componentDidMount() {
    this._load();
  }

  handleNext = () => {
    this.setState(state => ({
      activeStep: state.activeStep + 1
    }));
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1
    }));
  };

  handleReset = () => {
    this.setState({
      activeStep: 0
    });
  };

  handleModalOpen = () => {
    this.setState({ modalOpen: true });
  };

  handleModalClose = () => {
    this.setState({ modalOpen: false });
  };

  handleAddPromoter = () => {
    let promoters = this.state.promoters;

    promoters.push({ name: "", img: "", wpp: "", email: "", face_link: "" });

    this.setState(
      { promoters },
      // eslint-disable-next-line no-console
      console.log(this.state)
    );
  };

  handleRemovePromoter = () => {
    if (this.state.promoters.length > 1) {
      let promoters = this.state.promoters;

      promoters.pop();

      this.setState({
        promoters
      });
    }
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleChangePromoter = (index, input, value) => {
    // eslint-disable-next-line no-console
    console.log(index, input, value);

    let promoters = this.state.promoters;

    promoters[index][input] = value.target.value;

    this.setState({ promoters });
  };

  handleListSelect = (statePosition, cityPosition) => {
    const city = this.state.listStates[statePosition].cities[cityPosition];
  };

  showNotification(place, notification, color) {
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

  _save = async () => {
    const { state, city, promoters } = this.state;

    const data = {
      state,
      cities: [
        {
          city,
          promoters
        }
      ]
    };

    const response = await Service.post(data);

    if (response.code != 200) {
      let error = "";
      for (let x in response.errors) {
        error += response.errors[x].msg + ", ";
      }

      this.showNotification("tc", error, "danger");
    } else {
      this.showNotification("tc", "Cadastrado com sucesso!", "success");
    }
  };

  _load = async () => {
    // eslint-disable-next-line no-console
    const response = await Service.get();

    if (response.data.code === 200) {
      let listStates = [];
      response.data.caravans.forEach(caravan => {
        if (caravan.cities.length == 0) {
          caravan.cities = caravan.citys;
        }
        let state = { name: caravan.state, cities: caravan.cities };
        listStates.push(state);
      });

      this.setState({ caravans: response.data.caravans, listStates });
    } else {
      alert("Um erro ocorreu");
    }
  };

  getSteps() {
    return ["Cidade da caravana", "Promoters", "Confirmar"];
  }

  getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return this.renderFormCity();
      case 1:
        return this.renderResponsForm();
      case 2:
        return this.renderConfirm();
      default:
        return "WTF";
    }
  }

  renderFormCity() {
    const { classes } = this.props;
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4
                className={classes.cardTitleWhite}
              >{`Nova Caravana: Localização`}</h4>
              <p className={classes.cardCategoryWhite}>
                {`Preencha os campos abaixo para registrar a cidade da caravana`}
              </p>
            </CardHeader>
            <CardBody>
              <GridItem xs={12} sm={12} md={6}>
                <TextField
                  label="Cidade"
                  id="city"
                  value={this.state.city}
                  onChange={this.handleChange("city")}
                  fullWidth
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={6} style={{ marginTop: "23px" }}>
                <TextField
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
                </TextField>
              </GridItem>
            </CardBody>
            <CardFooter>{this.renderButtons()}</CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }

  renderResponsForm() {
    const { classes } = this.props;
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4
                className={classes.cardTitleWhite}
              >{`Nova Caravana: Promoters`}</h4>
              <p className={classes.cardCategoryWhite}>
                {`Preencha os campos abaixo adicionar um ou mais responsáveis pela caravana`}
              </p>
            </CardHeader>
            <CardBody>
              {this.renderRespons()}

              <Button
                size="small"
                color="secondary"
                aria-label="Remove"
                className={classes.button}
                onClick={this.handleRemovePromoter}
              >
                <DeleteIcon />
              </Button>

              <Button
                size="small"
                color="primary"
                aria-label="Add"
                className={classes.button}
                onClick={this.handleAddPromoter}
              >
                <AddIcon />
              </Button>
            </CardBody>
            <CardFooter>{this.renderButtons()}</CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }

  renderRespons() {
    const { classes } = this.props;

    let html = [];

    for (let x = 0; x < this.state.promoters.length; x++) {
      html.push(
        <div>
          <h4>Responsável {x + 1}</h4>
          <GridItem xs={12} sm={12} md={4}>
            <TextField
              label="Nome do promoter"
              id="name"
              value={this.state.promoters[x].name}
              onChange={value => this.handleChangePromoter(x, "name", value)}
              fullWidth
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <TextField
              label="WhatsApp"
              id="wpp"
              value={this.state.promoters[x].wpp}
              onChange={value => this.handleChangePromoter(x, "wpp", value)}
              fullWidth
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <TextField
              label="E-mail"
              id="email"
              value={this.state.promoters[x].email}
              onChange={value => this.handleChangePromoter(x, "email", value)}
              fullWidth
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            <TextField
              label="Link do Facebook"
              id="face_link"
              value={this.state.promoters[x].face_link}
              onChange={value =>
                this.handleChangePromoter(x, "face_link", value)
              }
              formControlProps={{
                fullWidth: true
              }}
            />
          </GridItem>
          <GridItem
            xs={12}
            sm={12}
            md={6}
            container
            direction="row"
            justify="center"
            alignItems="center"
          >
            <input
              accept="image/*"
              className={classes.input}
              id="outlined-button-file"
              type="file"
              style={{ display: "none" }}
            />
            <label htmlFor="outlined-button-file">
              <Button
                variant="outlined"
                component="span"
                className={classes.button}
              >
                Adicionar Imagem
              </Button>
            </label>
          </GridItem>
          <Divider />
        </div>
      );
    }
    return html;
  }

  renderConfirm() {
    const { classes } = this.props;
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4
                className={classes.cardTitleWhite}
              >{`Nova Caravana: Confirmar`}</h4>
              <p className={classes.cardCategoryWhite}>
                {`Confirme as informações abaixo para registrar a nova caravana`}
              </p>
            </CardHeader>
            <CardBody />
            <CardFooter>{this.renderButtons()}</CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }

  renderButtons() {
    const { classes } = this.props;
    const steps = this.getSteps();
    const { activeStep } = this.state;
    return (
      <div>
        <Button
          disabled={activeStep === 0}
          onClick={this.handleBack}
          className={classes.backButton}
        >
          Anterior
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={
            activeStep === steps.length - 1 ? this._save : this.handleNext
          }
        >
          {activeStep === steps.length - 1 ? "Finalizar" : "Próximo"}
        </Button>
        <Button color="transparent" onClick={this.handleModalClose}>
          Cancelar
        </Button>
      </div>
    );
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

  renderList() {
    const { classes } = this.props;
    return (
      <List className={classes.root} subheader={<li />}>
        {this.state.listStates.map((state, indexState) => (
          <li key={`section-${indexState}`} className={classes.listSection}>
            <ul className={classes.ul}>
              <ListSubheader>
                <h4
                  style={{
                    backgroundColor: "rgba(49,20,149,.8)",
                    color: "white"
                  }}
                >{`Caravanas de ${state.name}`}</h4>
              </ListSubheader>
              {state.cities.map((city, index) => (
                <ListItem
                  key={`item-${index}-${city}`}
                  onClick={() => {
                    this.handleListSelect(indexState, index);
                  }}
                >
                  <ListItemText primary={`${city.city}`} />
                  <Icon>edit_icon</Icon>
                </ListItem>
              ))}
            </ul>
          </li>
        ))}
      </List>
    );
  }

  render() {
    const { classes } = this.props;
    const steps = this.getSteps();
    const { activeStep } = this.state;
    // eslint-disable-next-line no-console
    console.log(this.state);
    if (this.state.modalOpen) {
      return (
        <div className={classes.paper}>
          {this.renderSnackbar()}
          <div className={classes.root}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map(label => {
                return (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            <div>
              {this.state.activeStep === steps.length ? (
                <div>
                  <Typography className={classes.instructions}>
                    All steps completed
                  </Typography>
                  <Button onClick={this.handleReset}>Reset</Button>
                </div>
              ) : (
                  <div>
                    <Typography className={classes.instructions}>
                      {this.getStepContent(activeStep)}
                    </Typography>
                  </div>
                )}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color="primary">
                  <h4 className={classes.cardTitleWhite}>
                    Caravanas Cadastradas
                </h4>
                  <p>
                    Área de gerenciamento das caravanas do site. Você pode inserir
                    uma nova caravana e editar as caravanas já existentes.
                </p>
                  <Button
                    onClick={this.handleModalOpen}
                    style={{ alignItems: "center", justifyContent: "center" }}
                    round
                    color="success"
                    className={classes.fabButton}
                  >
                    <AddIcon /> Nova Caravana
                </Button>
                </CardHeader>
                <CardBody>
                  {/* <Table
                  tableHeaderColor="primary"
                  tableHead={["Estado", "Quantidade", "Ação"]}
                  tableData={this.state.table}
                /> */}
                  {this.renderList()}
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
      );
    }
  }
}

export default withStyles(styles)(Caravans);
