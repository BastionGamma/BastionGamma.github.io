
// TO DO:
// - for each brand initialize a graph object
// - use rolling 3-day window to find top winner + loser

// DONE:
// - create index of all brands

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
String table = "coffee_beverages";
String query = "select brand, dayofyear(date), score_7 from " + table;

// Data
IntDict brandList = new IntDict();
String brand[] = new String[0];
int dayofyear[] = new int[0];
float score_7[] = new float[0];
int minDay, maxDay;
float maxScore;

// Rank Plot
ArrayList<plot> plotList;

// Draw
int margin = 50;
boolean record;
int markerSize = 4;

// - - - - - - - - - - - - - - - - - - - - -

void setup() {
  size(1600, 900); 
  fetchEntries();
  buildPlots();
}

// - - - - - - - - - - - - - - - - - - - - -

void draw() {
  startPrint();
  background(50);
  for (int i=0; i<15; i++) {
    plotList.get(i).display();
  }
  endPrint();
}