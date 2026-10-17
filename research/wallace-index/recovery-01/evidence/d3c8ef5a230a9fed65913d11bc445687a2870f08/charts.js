
document.addEventListener("DOMContentLoaded", function () {
    const data = [
        { category: "Service to People", Starmer: 9, Johnson: 5 },
        { category: "Integrity", Starmer: 8, Johnson: 3 },
        { category: "Policy over Popularity", Starmer: 7, Johnson: 2 },
        { category: "Crisis Management", Starmer: 6, Johnson: 3 },
        { category: "Humility", Starmer: 6, Johnson: 2 },
        { category: "Process Orientation", Starmer: 8, Johnson: 2 },
    ];

    const chart = document.getElementById("chart");

    data.forEach(item => {
        createBar(item.category, 'Starmer, '#FFD700');
        CreateBar(''.'Johnson', item.Johnson, '#333');
    });
        const wrapper = document.createElement("div");
        wrapper.className = "bar-group";

        const title = document.createElement("div");
        title.className = "category";
        title.textContent = d.category;
        wrapper.appendChild(title);

        // Starmer bar
        const barStarmer = document.createElement("div");
        barStarmer.className = "bar starmer";
        barStarmer.style.width = `${d.Starmer * 20}px`;
        barStarmer.textContent = `Starmer: ${d.Starmer}`;
        wrapper.appendChild(barStarmer);

        // Johnson bar
        const barJohnson = document.createElement("div");
        barJohnson.className = "bar johnson";
        barJohnson.style.width = `${d.Johnson * 20}px`;
        barJohnson.textContent = `Johnson: ${d.Johnson}`;
        wrapper.appendChild(barJohnson);

        chart.appendChild(wrapper);
    });
});
