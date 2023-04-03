
// TO DO:
// - Add title and number of brands
// - Draw brands that only appear in set B
// - Hilight the WINNER
// - Hilight the NORM

// DONE:
// - Hilight the GAINER
// - Hilight the LOSER
// - Hover to hilight brand
// - Draw hover state
// - Fix Z-axis issue

// Libraries
import de.bezier.data.sql.*;
import processing.pdf.*;

// mySQL Setup
MySQL msql;
String user = "root";
String pass = "";
String database = "L2";
String table = "juice"; // "soda", "juice", "water", "baby_foods", "coffee_beverages", "grocery"
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
  size(1000, 1000); 
  scoresA = fetchMetrics(monthA, scoresA);
  scoresB = fetchMetrics(monthB, scoresB);
  selectedBrand = int(random(0, scoresA.size()));
}

// - - - - - - - - - - - - - - - - - - - - -

void draw() {
  startPrint();
  background(0);
  updateSelectedBrand();
  drawDivider();
  drawData();
  endPrint();
}