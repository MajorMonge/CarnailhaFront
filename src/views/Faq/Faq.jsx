import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import Table from "components/Table/Table.jsx";
import AddIcon from "@material-ui/icons/Add";

import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";

import Icon from "@material-ui/core/Icon";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";

import axios from 'axios';
import { userInfo } from "os";
import { IconButton } from "@material-ui/core";

import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import deburr from 'lodash/deburr';
import PropTypes from 'prop-types';
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
};

const baseUrl = 'http://localhost:5000/api/v1/faq'
const initialState = {
  type: '',
  questions: { question: '', answer: '' },
  list: [],
  suggestions: [],

  modalOpen: false,
  notification: "",
      color: "info",
      tc: false,
      edit: false
}

const suggestions = [
  { name: 'Alojamento' },
  { name: 'Compra' },
  { name: 'Dúvidas Gerais' },
  { name: 'Retirada de Kits e Pulseiras' },
  { name: 'Transporte' },
];

function renderInputComponent(inputProps) {
  const { classes, inputRef = () => { }, ref, ...other } = inputProps;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputRef: node => {
          ref(node);
          inputRef(node);
        },
        classes: {
          input: classes.input,
        },
      }}
      {...other}
    />
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.name, query);
  const parts = parse(suggestion.name, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map((part, index) =>
          part.highlight ? (
            <span key={String(index)} style={{ fontWeight: 500 }}>
              {part.text}
            </span>
          ) : (
              <strong key={String(index)} style={{ fontWeight: 300 }}>
                {part.text}
              </strong>
            ),
        )}
      </div>
    </MenuItem>
  );
}

function getSuggestions(value) {
  const inputValue = deburr(value.trim()).toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0
    ? []
    : suggestions.filter(suggestion => {
      const keep =
        count < 5 && suggestion.name.slice(0, inputLength).toLowerCase() === inputValue;

      if (keep) {
        count += 1;
      }

      return keep;
    });
}

function getSuggestionValue(suggestion) {
  return suggestion.name;
}

class Faq extends React.Component {

  state = { ...initialState }

  clear() {
    this.setState({ questions: initialState.questions }),
      this.setState({ type: initialState.type })
  }

  save() {
    const questions = this.state.questions
    const method = questions.id ? 'put' : 'post'
    const url = questions.id ? `${baseUrl}/${questions.id}` : baseUrl
    axios[method](url, questions)
      .then(resp => {
        const list = this.getUpdatedList(resp.data)
        this.setState({ questions: initialState.questions, list })
      })
  }

  getUpdatedList(questions) {
    const list = this.state.list.filter(u => u.id !== userInfo.id)
    if (questions) list.unshift(questions)
    return list
  }

  updateField(event) {
    const questions = { ...this.state.questions }
    questions[event.target.question] = event.target.value
    this.setState({ questions })
  }

  load(questions) {
    this.setState({ questions })
  }

  remove(questions) {
    axios.delete(`${baseUrl}/${questions.id}`).then(resp => {
      const list = this.getUpdatedList(null)
      this.setState({ list })
    })
  }

  handleModalOpen = () => {
    this.setState({ modalOpen: true });
  };

  handleModalClose = () => {
    this.setState({ modalOpen: false });
  };

  /* Suggestions */
  handleSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value),
    });
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  handleChange = name => (event, { newValue }) => {
    this.setState({
      [name]: newValue,
    });
  };

  renderForm() {
    const { classes } = this.props;

    const autosuggestProps = {
      renderInputComponent,
      suggestions: this.state.suggestions,
      onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
      onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
      getSuggestionValue,
      renderSuggestion,
    };

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>Nova FAQ</h4>
                <p>
                  Preencha os campos abaixo para registrar uma nova faq
              </p>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={5} className={classes.root}>
                    <Autosuggest
                      {...autosuggestProps}
                      inputProps={{
                        classes,
                        label: 'Tipo de FAQ',
                        value: this.state.type,
                        onChange: this.handleChange('type'),
                      }}
                      renderSuggestionsContainer={options => (
                        <Paper {...options.containerProps} square>
                          {options.children}
                        </Paper>
                      )}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <CustomInput
                      labelText="Pergunta"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        disabled: false
                      }}
                    /* question="question"
                    value={this.state.questions.question}
                    onChange={e => this.updateField(e)} */
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <CustomInput
                      labelText="Resposta"
                      formControlProps={{
                        fullWidth: true
                      }}
                    /* answer="answer"
                    value={this.state.questions.answer}
                    onChange={e => this.updateField(e)} */
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                <Button color="primary"
                  onClick={e => this.save(e)}>
                  Salvar
              </Button>
                <Button
                  onClick={this.handleModalClose}>
                  Cancelar
              </Button>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    )
  }

  renderList() {
    const { classes } = this.props;
    return (
      <List className={classes.root} subheader={<li />}>
        <Card>
          <ListSubheader>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Alojamento</h4>
            </CardHeader>
          </ListSubheader>
          <ListItem>
            <ListItemText primary={``} />
            <IconButton>
              <i class="material-icons">edit</i>
            </IconButton>
          </ListItem>
        </Card>
      </List>
    );
  }

  render() {
    const { classes } = this.props;
    if (this.state.modalOpen) {
      return (
        <main>
          {this.renderForm()}
        </main>
      )
    } else {
      return (
        <div>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color="primary">
                  <h4 className={classes.cardTitleWhite}>
                    FAQ's Cadastradas
                </h4>
                  <p>
                    Área de gerenciamento das FAQ's do site. Você pode inserir
                    uma nova FAQ e editar as já existentes.
                </p>
                  <Button
                    onClick={this.handleModalOpen}
                    style={{ alignItems: "center", justifyContent: "center" }}
                    round
                    color="success"
                    className={classes.fabButton}
                  >
                    <AddIcon /> Nova FAQ
                </Button>
                </CardHeader>
                <CardBody>
                  {this.renderList()}
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
      )
    }
  }
}

Faq.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Faq);
