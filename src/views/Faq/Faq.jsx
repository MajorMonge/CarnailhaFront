import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import InfoIcon from "@material-ui/icons/Info";
import Divider from "@material-ui/core/Divider";
import Snackbar from "components/Snackbar/Snackbar.jsx";

import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";

import { IconButton } from "@material-ui/core";


import TextField from '@material-ui/core/TextField';

import Service from "../../services/faq";

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

class Faq extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      faqs: [],
      listTypes: [],

      type: "",
      questions: [
        {
          question: "",
          answer: ""
        }
      ],

      action: 0, //0- listagem, 1- insert type, 2- insert question
      indexTypes: null,

      notification: "",
      color: "info",
      tc: false,
      edit: false
    };
  }

  componentDidMount() {
    this._load();
  };

  handleAddQuestion = () => {
    let questions = this.state.questions;

    questions.push({ question: "", answer: "" });

    this.setState(
      { questions },
    );
  };

  handleRemoveQuestion = () => {
    if (this.state.questions.length > 1) {
      let questions = this.state.questions;

      questions.pop();

      this.setState({
        questions
      });
    }
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleChangeQuestion = (index, input, value) => {
    let questions = this.state.questions;

    questions[index][input] = value.target.value;

    this.setState({ questions });
  };

  handleListSelect = (typePosition, faqPosition) => {
    const type = this.state.listTypes[typePosition];

    const { question, answer } = this.state.listTypes[typePosition].questions[faqPosition];

    this.setState({ question, answer, action: 3 });
  };

  handleClearFields = () => {
    const type = "",
      action = 0,
      indexTypes = null,
      questions = [{ question: "", answer: "" }];

    this.setState({ type, questions, indexTypes, action });
  };

  showNotification(place, notification, color) {
    console.log("MOSTRANDO NOTIFICAÇÂO");
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
    const { type, questions } = this.state;

    const data = {
      type, questions
    };

    const response = await Service.post(data);

    let msg = "",
      tipo = "";
    if (response.code != 201) {
      for (let x in response.errors) {
        msg += response.errors[x].msg + ", ";
      }
      tipo = "danger";
    } else {
      msg = "Cadastrado com sucesso!";
      tipo = "success";
      type.push(response.faq);
      this.setState({ type });
    }
    this.setState({ action: 0 });
    this.showNotification("tc", msg, tipo);
  };

  _update = async () => {
    const { indexTypes, listTypes, questions } = this.state;
    const type = listTypes[indexTypes];
    questions.forEach((question)=>{
      type.questions.push({question:question.question, answer:question.answer});
    })


   

    const data = {
      type: type.name,
      questions: type.questions
    };

    console.log(data);

    const response = await Service.update(data);

    let msg = "",
      tipo = "";
    if (response.code != 201) {
      for (let x in response.errors) {
        msg += response.errors[x].msg + ", ";
      }
      tipo = "danger";
    } else {
      msg = "Alterado com sucesso!";
      tipo = "success";

      listTypes.push(type);

      this.setState({ listTypes });
    }

    this.setState({ action: 0 });
    this.showNotification("tc", msg, tipo);
  };

  _load = async () => {
    // eslint-disable-next-line no-console
    const response = await Service.get();

    let listTypes = [];
    if (response.data.code === 200) {
      response.data.faqs.forEach(faq => {
        let type = {
          _id: faq._id,
          name: faq.type,
          questions: faq.questions
        };
        listTypes.push(type);
      });

      console.log(listTypes);

      this.setState({ faqs: response.data.faqs, listTypes });
    } else {
      alert("Um erro ocorreu");
    }
  };

  _delete = async () => {
    const { accommodations, rows, id, _id } = this.state;
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
      let acc = accommodations;
      let r = rows;
      let count = id - 1;
      acc.splice(count, 1);
      rows.splice(count, 1)
      this.setState({ accommodations: acc, rows: r });
    }

    this.setState({ action: 0 });
    this.showNotification("tc", msg, types);
  };

  renderFormType() {
    // eslint-disable-next-line react/prop-types
    const { classes } = this.props;
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>{`Novo Tipo`}</h4>
              <p className={classes.cardCategoryWhite}>
                {`Você está liberando um novo tipo de FAQ. Caso queira adicionar uma FAQ a um tipo já existente, clique no botão + que está na frente do nome da FAQ na lista inicial. `}
              </p>
            </CardHeader>
            <CardBody>
              <GridItem xs={12} sm={12} md={12} style={{ marginTop: "23px" }}>
                <TextField
                  label="Tipo da FAQ"
                  id="type"
                  value={this.state.type}
                  onChange={this.handleChange("type")}
                  fullWidth
                />

                <Button
                  size="small"
                  color="secondary"
                  aria-label="Add"
                  className={classes.button}
                  onClick={() => {
                    this.handleClearFields();
                  }}
                >
                  Voltar
                </Button>
                <Button
                  size="small"
                  color="primary"
                  aria-label="Add"
                  className={classes.button}
                  onClick={() => {
                    this.setState({ action: 2 });
                  }}
                >
                  Adicionar Tipo
                </Button>
              </GridItem>
            </CardBody>
            <CardFooter>
              <GridItem xs={12} sm={12} md={12}>
                <p>Tipos já cadastrados:</p>
                <ul>
                  {this.state.listTypes.map(type => (
                    // eslint-disable-next-line react/jsx-key
                    <li>{`${type.name}`}</li>
                  ))}
                </ul>
              </GridItem>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }

  renderFormEdit() {
    // eslint-disable-next-line react/prop-types
    const { classes } = this.props;
    const { indexTypes, listTypes } = this.state;

    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>
                {`Editar FAQ ${indexTypes != null ? listTypes[indexTypes].name : "criada"} `}
              </h4>
              <p className={classes.cardCategoryWhite}>
                {`Você está editando uma FAQ do Tipo ${indexTypes != null ? listTypes[indexTypes].name : "criado"}`}
              </p>
            </CardHeader>
            <CardBody>
              <GridItem xs={12} sm={12} md={12} style={{ marginTop: "23px" }}>
                <TextField
                  label="FAQ"
                  id="faq"
                  value={this.state.faq}
                  onChange={this.handleChange("faq")}
                  fullWidth
                />

                <Button
                  size="small"
                  color="secondary"
                  aria-label="Add"
                  className={classes.button}
                  onClick={() => {
                    this.state.type == ""
                      ? this.setState({ action: 0 })
                      : this.setState({ action: 1 });
                  }}
                >
                  Voltar
                </Button>
                <Button
                  size="small"
                  color="primary"
                  aria-label="Add"
                  className={classes.button}
                  onClick={() => {
                    this.state.indexTypes == null
                      ? this._save()
                      : this._update();
                  }}
                >
                  Salvar
                </Button>
              </GridItem>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }

  renderResponsForm() {
    const { classes } = this.props;
    const { indexTypes, listTypes } = this.state;
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4
                className={classes.cardTitleWhite}
              >{`Nova FAQ: Perguntas e Respostas`}</h4>
              <p className={classes.cardCategoryWhite}>
                {`Preencha os campos abaixo adicionar uma ou mais Perguntas e Respostas ao Tipo 
                ${indexTypes != null ? listTypes[indexTypes].name : "criado"}`}
              </p>
            </CardHeader>
            <CardBody>
              {this.renderRespons()}

              <Button
                size="small"
                color="secondary"
                aria-label="Remove"
                className={classes.button}
                onClick={this.handleRemoveQuestion}
              >
                <DeleteIcon />
              </Button>

              <Button
                size="small"
                color="primary"
                aria-label="Add"
                className={classes.button}
                onClick={this.handleAddQuestion}
              >
                <AddIcon />
              </Button>
              <GridItem xs={12} sm={12} md={12}>
                <Button
                  size="small"
                  color="secondary"
                  aria-label="Add"
                  className={classes.button}
                  onClick={() => {
                    this.setState({ action: 0 });
                  }}
                >
                  Voltar
                </Button>
                <Button
                  size="small"
                  color="primary"
                  aria-label="Add"
                  className={classes.button}
                  onClick={() => {
                    this.state.indexTypes == null
                      ? this._save()
                      : this._update();
                  }}
                >
                  Salvar
                </Button>
              </GridItem>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }

  renderRespons() {
    const { classes } = this.props;

    let html = [];

    for (let x = 0; x < this.state.questions.length; x++) {
      html.push(
        <div>
          <h4>Pergunta e Resposta {x + 1}</h4>
          <GridItem xs={12} sm={12} md={12}>
            <TextField
              label="Pergunta"
              id="question"
              value={this.state.questions[x].question}
              onChange={value => this.handleChangeQuestion(x, "question", value)}
              fullWidth
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={12}>
            <TextField
              label="Resposta"
              id="answer"
              value={this.state.questions[x].answer}
              onChange={value => this.handleChangeQuestion(x, "answer", value)}
              fullWidth
            />
            <p> </p>
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
              >{`Nova FAQ: Confirmar`}</h4>
              <p className={classes.cardCategoryWhite}>
                {`Confirme as informações abaixo para registrar a nova FAQ`}
              </p>
            </CardHeader>
            <CardBody />
            <CardFooter />
          </Card>
        </GridItem>
      </GridContainer>
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
        {this.state.listTypes.map((type, indexTypes) => (
          <li key={`section-${indexTypes}`} className={classes.listSection}>
            <ul className={classes.ul}>
              <ListSubheader>
                <h4
                  style={{
                    backgroundColor: "rgba(49,20,149,.8)",
                    color: "white",
                    padding: "10px",
                    borderRadius: "5px"
                  }}
                >
                  {`${type.name}`}
                  <AddIcon
                    style={{
                      float: "right",
                      borderRadius: "100%",
                      border: "1px solid #FFF",
                      cursor: "pointer"
                    }}
                    onClick={() => {
                      this.setState({ indexTypes, faq:this.state.listTypes[indexTypes], action: 2 });
                    }}
                  />
                </h4>
              </ListSubheader>
              {type.questions.map((question, index) => (
                <ListItem
                  key={`item-${index}-${question}`}
                  onClick={() => {
                    this.handleListSelect(indexTypes, index);
                  }}
                >
                  <ListItem>
                    <div style={{flexDirection: "column"}}>
                    <p> {`${index + 1}) ${question.question}`} </p>
                    <p> {`R: ${question.answer}`} </p>
                    <Divider/>
                    </div>
                    <IconButton>
                      <i class="material-icons">edit</i>
                    </IconButton>
                  </ListItem>
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

    switch (this.state.action) {
      case 0:
        return (
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              {this.renderSnackbar()}
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>
                  FAQ's Cadastradas
                </h4>
                <p>
                  Área de gerenciamento das FAQ's do site. Você pode inserir uma nova FAQ e editar as já existentes.
                </p>
                <Button
                  onClick={() => this.setState({ action: 1 })}
                  style={{ alignItems: "center", justifyContent: "center" }}
                  round
                  color="success"
                  className={classes.fabButton}
                >
                  <AddIcon /> Novo Tipo
                </Button>
              </CardHeader>
              <CardBody>
                {this.renderList()}
              </CardBody>
            </Card>
          </GridItem>
        );
      case 1:
        return this.renderFormType();
      case 2:
        return this.renderResponsForm();
      case 3:
        return this.renderFormEdit();
    }
  }
}

export default withStyles(styles)(Faq);
