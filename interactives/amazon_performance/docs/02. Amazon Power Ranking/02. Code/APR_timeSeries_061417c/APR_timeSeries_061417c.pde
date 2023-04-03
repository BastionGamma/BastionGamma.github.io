
// TO DO:
// - reduce timeframe to single month (MAY)
// - use mouseY to scan through selected brand
// - add hover state to mouseY
// - compute and display brand NORM
// - compute and display MOST VOLATILE brand
// - recompute WINNER / LOSER to use score_30
// - issue with isolated single point not being represented by lines

// DONE:
// - show selected graph
// - order selected brand by avg rank
// - compute and display TOP brand
// - compute and display WINNING brand
// - compute and display LOSING brand
// - don't connect discontinuous data

// TERMINOLOGY
// Rank: The best rated product of the brand on that day
// Visibility: Does the brand have at least one product in the rankings on that day
// Real Estate: The number of products the brand has in the rankings divided by the total number of products in the rankings

// Libraries
import de.bezier.data.sql.*;
import processing.pdf.*;

// mySQL Setup
MySQL msql;
String user = "root";
String pass = "";
String database = "L2";
String table = "soda";
String queryBrands = "select brand, avg(distinct score_7) as s from " + table + " group by brand order by s desc";
String queryScores = "select dayofyear(date), score_7 from " + table + " where brand=\'temp\' and score_7 is not null";

// Data
String brands[] = new String[0];
int minDay, maxDay;
float maxScore;
float maxWin = 0;
float maxLose = 0;
int selectedBrand, winningBrand, losingBrand;

// Rank Plot
ArrayList<plot> plotList;

// Draw
int margin = 50;

// - - - - - - - - - - - - - - - - - - - - -

void setup() {
  size(1200, 600); 
  fetchBrands();
  selectedBrand = int(random(0, brands.length));
  initPlots();
  //findLoser();
  //findErratic();
  //computeNorm();
}

// - - - - - - - - - - - - - - - - - - - - -

void draw() {
  background(50);
  for (int i=0; i<plotList.size(); i++) {  // plotList.size()
    plotList.get(i).display();
  }
}