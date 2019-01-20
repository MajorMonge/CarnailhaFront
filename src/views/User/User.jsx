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
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import Table from "components/Table/Table.jsx";
import AddIcon from "@material-ui/icons/Add";



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

const initialState = {
  type: [],
  questions: { question: '', answer: '' },
  list: []
}

class User extends React.Component {

  state = { ...initialState }

  handleModalOpen = () => {
    this.setState({ modalOpen: true });
  };

  handleModalClose = () => {
    this.setState({ modalOpen: false });
  };

  renderForm() {
    const { classes } = this.props;
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>Editar Usuário</h4>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Nome"
                      id="nome"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        disabled: false
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Email"
                      id="email-address"
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Status"
                      id="status"
                      formControlProps={{
                        fullWidth: true
                      }}
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
    );
  }

  renderList() {
    const { classes } = this.props;
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <CardBody>
            {<Table
              tableHeaderColor="primary"
              tableHead={["Nome", "E-mail", "Status", ""]}
              tableData={[
                ["Kendrick Lammar", "ken_lam@gmail.com", "Ausente", ""],
                ["Minerva Hooper", "Curaçao@hotmail.com", "Disponivel", ""],
                ["Sage Rodriguez", "Nether@bol.com", "Indisponivel", ""],
                ["Philip Chaney", "KoreSou@yahoo.com", "Ausente", ""],
                ["Doris Greene", "Malawi@ig.com", "disponivel", ""],
                ["Mason Porter", "Chill@gmail.com", "Disponivel", ""]
              ]}
            />}
          </CardBody>
        </GridItem>
      </GridContainer>
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
                    Usuários Cadastrados
                </h4>
                  <p>
                    Área de gerenciamento dos usuários do site. Você pode inserir
                    um novo usuário e editar os já existentes.
                </p>
                  <Button
                    onClick={this.handleModalOpen}
                    style={{ alignItems: "center", justifyContent: "center" }}
                    round
                    color="success"
                    className={classes.fabButton}
                  >
                    <AddIcon /> Novo Usuário
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



export default withStyles(styles)(User);
