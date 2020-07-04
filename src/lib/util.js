module.exports = {
  date(timestamp) {
    const date = new Date(timestamp);

    //Pega o ano yyyy
    const year = date.getUTCFullYear();

    //Pega o mês mm, os meses são contados de 0 a 11, por isso o +1
    //as crases colocam zempre um zero no frente do valor, porém, o slice
    //só pega os ultimos dois caracteres
    const month = `0${date.getUTCMonth() + 1}`.slice(-2);

    //Pega o dia dd
    const day = `0${date.getUTCDate()}`.slice(-2);

    return {
      iso: `${year}-${month}-${day}`,
      format: `${day}/${month}/${year}`,
    }
  },
}