import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Table from "components/Table/Table.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  }
};

function FaqList(props) {
  const { classes } = props;
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="info">
            <h4 className={classes.cardTitleWhite}>FAQ</h4>
          </CardHeader>
          <CardBody>
            <Table
              tableHeaderColor="info"
              tableHead={["Perguntas", "Respostas", "Área"]}
              tableData={[
                ["Quais os dias e horários do evento?", "O Carnailha ocorre entre os dias 01 e 05 de março de 2019, das 18h00 às 04h00 do dia seguinte.", "Dúvidas Gerais"],
                ["Qual o local do evento?", "Ilha Solteira, na Praia Catarina.", "Dúvidas Gerais"],
                ["O evento é open bar?", "Sim, bora encher a cara galerê.", "Dúvidas Gerais"],
                ["A entrada de menores de idade é proibida?", "Sim, por ser openbar.", "Dúvidas Gerais"],
                ["Hoje sou menor de idade, mas terei mais de 18 anos no carnaval, posso comprar meu pacote no meu nome?", "Você pode comprar sim bb, mas para retirar o pacote só acima de dz8.", "Dúvidas Gerais"],
                ["Onde compro meu pacote?", "Através da plataforma online da BlackTag.", "Compra"]
              ]}
            />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}

export default withStyles(styles)(FaqList);
