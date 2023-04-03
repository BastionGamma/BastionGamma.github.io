
// TO DO:
// - solution for lines sharing qualities
// - key-command for changing table
// - label table
// - add score delta to selected brand
// - issue with isolated single point not being represented by lines
// - limit decimal places in right column

// DONE:
// - show selected graph
// - order selected brand by avg rank
// - compute and display TOP brand
// - compute and display WINNING brand
// - compute and display LOSING brand
// - don't connect discontinuous data
// - compute and display brand NORM
// - reduce timeframe to single month (MAY)
// - add date range to bottom margin
// - use mouseY to scan through selected brand
// - add hover state to mouseY
// - compute and display MOST VOLATILE brand

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
String table = "juice"; // soda // baby_foods // coffee_beverages // grocery
int month = 5;
int year = 2017;
String queryBrands = "select brand, avg(distinct score_7) as s from " + table + " where month(date)=" + month + " and year(date)=" + year + " group by brand order by s desc";
String queryScores = "select dayofyear(date), score_7 from " + table + " where brand=\'temp\' and score_7 is not null and month(date)=" + month + " and year(date)=" + year;

// Data
String brands[] = new String[0];
int minDay, maxDay;
float maxScore;
float maxWin = 0;
float maxLose = 0;
float maxSD = 0;
int selectedBrand, winningBrand, losingBrand, variableBrand;
String monthList[] = {"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"};
int monthDays[];

// Rank Plot
ArrayList<plot> plotList;

// Draw
int margin = 50;
int hoverDay = 0;

// - - - - - - - - - - - - - - - - - - - - -

void setup() {
  size(1600, 800); 
  fetchBrands();
  initPlots();
  selectedBrand = int(random(0, plotList.size()));
}

// - - - - - - - - - - - - - - - - - - - - -

void draw() {
  background(50);
  for (int i=0; i<plotList.size(); i++) {  // plotList.size()
    plotList.get(i).display();
  }
  drawDates();
  updateSelectedBrand();
  updateHover();
}