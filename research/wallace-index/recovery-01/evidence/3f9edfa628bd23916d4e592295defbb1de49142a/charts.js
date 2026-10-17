
const chart = document.getElementById('chart');

const data = [
    { label: "Service to People", starmer: 9, johnson: 5 },
    { label: "Integrity", starmer: 8, johnson: 3 },
    { label: "Policy over Popularity", starmer: 7, johnson: 2 },
    { label: "Crisis Management", starmer: 6, johnson: 2 },
    { label: "Humility", starmer: 6, johnson: 1 },
    { label: "Process Orientation", starmer: 8, johnson: 2 },
];

data.forEach(item => {
    const group = document.createElement('div');
    group.className = 'bar-group';

    const label = document.createElement('div');
    label.className = 'bar-label';
    label.textContent = item.label;
    group.appendChild(label);

    const bar1 = document.createElement('div');
    bar1.className = 'bar bar-yellow';
    bar1.style.width = item.starmer * 20 + 'px';
    bar1.textContent = " Starmer: " + item.starmer;

    const bar2 = document.createElement('div');
    bar2.className = 'bar bar-grey';
    bar2.style.width = item.johnson * 20 + 'px';
    bar2.textContent = " Johnson: " + item.johnson;

    group.appendChild(bar1);
    group.appendChild(bar2);
    chart.appendChild(group);
});
