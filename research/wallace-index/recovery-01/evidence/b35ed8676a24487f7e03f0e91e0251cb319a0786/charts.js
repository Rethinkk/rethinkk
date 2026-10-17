
const dataStarmer = {
  labels: ['People', 'Process', 'Policy', 'Crisis', 'Humility', 'Service'],
  datasets: [{
    label: 'Keir Starmer',
    data: [2, 3, 2, 2, 2, 3],
    fill: true,
    backgroundColor: 'rgba(255, 204, 0, 0.2)',
    borderColor: 'rgba(255, 204, 0, 1)',
    pointBackgroundColor: 'rgba(255, 204, 0, 1)'
  }]
};

const dataBoris = {
  labels: ['People', 'Process', 'Policy', 'Crisis', 'Humility', 'Service'],
  datasets: [{
    label: 'Boris Johnson',
    data: [1, 0, 2, 1, 0, 1],
    fill: true,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderColor: 'rgba(0, 0, 0, 1)',
    pointBackgroundColor: 'rgba(0, 0, 0, 1)'
  }]
};

new Chart(document.getElementById('chartStarmer'), {
  type: 'radar',
  data: dataStarmer,
  options: { elements: { line: { borderWidth: 3 } } }
});

new Chart(document.getElementById('chartBoris'), {
  type: 'radar',
  data: dataBoris,
  options: { elements: { line: { borderWidth: 3 } } }
});
