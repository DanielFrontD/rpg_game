const { COLORS } = require("../shared/constants");

const stories = [
  {
    firstVisit: `${COLORS.YELLOW}-- No sabes donde estas, escuchas un sonido que viene de mas adelante${COLORS.RESET}`,
    revisit: `${COLORS.YELLOW}-- Investiga de donde viene ese sonido${COLORS.RESET}`,
  },
  {
    firstVisit: `${COLORS.YELLOW}-- El sonido se hace mas fuerte, parece venir de un pasillo oscuro${COLORS.RESET}`,
    revisit: `${COLORS.YELLOW}-- El pasillo oscuro sigue adelante, no te detengas${COLORS.RESET}`,
  },
  {
    firstVisit: `${COLORS.YELLOW}-- Llegaste a una sala enorme, hay una mujer misteriosa que esta siendo atacada por un monstruo${COLORS.RESET}`,
    revisit: `${COLORS.YELLOW}-- La mujer sigue en peligro, debes ayudarla${COLORS.RESET}`,
  },
];

module.exports = stories;
