
// TO DO:
// - Fix Z-axis issue
// - Draw brands that appear or disappear
// - Hilight WINNER
// - Hilight NORM

// DONE:
// - Hilight GAINER
// - Hilight LOSER
// - Hover to hilight brand
// - Draw hover state

// Libraries
import de.bezier.data.sql.*;
import processing.pdf.*;

// mySQL Setup
MySQL msql;
String user = "root";
String pass = "";
String database = "L2";
String table = "soda";
String avgQuery = "select brand, avg(distinct score_7) as s from " + table + " where month(date)=MM group by brand order by s desc";

// Data
int monthA = 3;
int monthB = 6;
FloatDict scoresA = new FloatDict();
FloatDict scoresB = new FloatDict();
String monthList[] = {"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"};

// Draw
int margin = 50;
boolean record;
int markerSize = 6;
int selectedBrand;

// - - - - - - - - - - - - - - - - - - - - -

void setup() {
  size(800, 800); 
  scoresA = fetchMetrics(monthA, scoresA);
  scoresB = fetchMetrics(monthB, scoresB);
  selectedBrand = int(random(0, scoresA.size()));
}

// - - - - - - - - - - - - - - - - - - - - -

void draw() {
  startPrint();
  background(50);
  updateSelectedBrand();
  drawDivider();
  drawData();
  endPrint();
}