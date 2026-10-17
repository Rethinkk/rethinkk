
const data = [
  { category: "Service to People", Starmer: 9, Johnson: 5 },
  { category: "Integrity", Starmer: 8, Johnson: 3 },
  { category: "Policy over Popularity", Starmer: 7, Johnson: 2 },
  { category: "Crisis Management", Starmer: 6, Johnson: 3 },
  { category: "Humility", Starmer: 6, Johnson: 2 },
  { category: "Process Orientation", Starmer: 8, Johnson: 2 }
];

const container = document.getElementById('chart-container');

data.forEach(item => {
  const categoryLabel = document.createElement('div');
  categoryLabel.className = 'category-label';
  categoryLabel.innerText = item.category;
  container.appendChild(categoryLabel);

  const barStarmer = document.createElement('div');
  barStarmer.className = 'bar bar-starmer';
  barStarmer.style.width = `${item.Starmer * 20}px`;
  barStarmer.innerText = `Starmer: ${item.Starmer}`;
  container.appendChild(barStarmer);

  const barJohnson = document.createElement('div');
  barJohnson.className = 'bar bar-johnson';
  barJohnson.style.width = `${item.Johnson * 20}px`;
  barJohnson.innerText = `Johnson: ${item.Johnson}`;
  container.appendChild(barJohnson);
});
