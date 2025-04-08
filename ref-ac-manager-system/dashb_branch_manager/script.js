document.addEventListener('DOMContentLoaded', function() {
    // Get all region headers
    const regionHeaders = document.querySelectorAll('.region-header');

    // Add click event listener to each header
    regionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            // Get the parent region item
            const regionItem = this.closest('.region-item');
            
            // Toggle active class on the clicked region
            regionItem.classList.toggle('active');
            
            // Close other regions
            regionHeaders.forEach(otherHeader => {
                const otherRegion = otherHeader.closest('.region-item');
                if (otherRegion !== regionItem) {
                    otherRegion.classList.remove('active');
                }
            });
        });
    });

    // Get all branch items
    const branchItems = document.querySelectorAll('.branch-item');

    // Add click event listener to each branch
    branchItems.forEach(branch => {
        branch.addEventListener('click', function(e) {
            // Remove selected class from all branches
            branchItems.forEach(b => b.classList.remove('selected'));
            
            // Add selected class to clicked branch
            this.classList.add('selected');
            
            // Prevent the click from bubbling up to the region header
            e.stopPropagation();
        });
    });

    // Add navigation toggle functionality
    const navToggle = document.querySelector('.nav-toggle');
    const dashboardContainer = document.querySelector('.dashboard-container');

    navToggle.addEventListener('click', function() {
        dashboardContainer.classList.toggle('nav-open');
    });

    // Close navigation when clicking outside
    document.addEventListener('click', function(e) {
        if (dashboardContainer.classList.contains('nav-open') &&
            !e.target.closest('.branch-selector') &&
            !e.target.closest('.nav-toggle')) {
            dashboardContainer.classList.remove('nav-open');
        }
    });

    // Function to open the modal and populate data
    window.openModal = function(unitName) {
        const modal = document.getElementById("detailsModal");
        const updateLogs = document.getElementById("updateLogs");
        
        // Example data for the chart and logs
        const temperatureData = [2.5, 2.7, 2.6, 2.8, 2.4]; // Example temperature data
        const labels = ['2024-03-19 14:00', '2024-03-19 14:10', '2024-03-19 14:20', '2024-03-19 14:30', '2024-03-19 14:40'];

        // Populate update logs (example)
        updateLogs.innerHTML = `<p>Last maintenance: 2024-03-18</p><p>Issues reported: None</p>`;

        // Create the chart
        const ctx = document.getElementById('temperatureChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: unitName + ' Temperature',
                    data: temperatureData,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        modal.style.display = "block"; // Show the modal
    };

    // Function to close the modal
    window.closeModal = function() {
        const modal = document.getElementById("detailsModal");
        modal.style.display = "none"; // Hide the modal
    };

    // Close modal when clicking outside of it
    window.onclick = function(event) {
        const modal = document.getElementById("detailsModal");
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };

    // Function to edit a unit
    window.editUnit = function(button) {
        const unitCard = button.parentElement.parentElement; // Get the parent unit card
        const unitName = unitCard.querySelector('h3').innerText; // Get the unit name
        const statusText = unitCard.querySelector('.status-text').innerText; // Get the current status
        const tempText = unitCard.querySelector('.temp').innerText; // Get the current temperature

        // Populate the form with current values (you can create a modal for editing)
        document.getElementById('unitName').value = unitName;
        document.getElementById('unitStatus').value = statusText;
        document.getElementById('unitTemperature').value = tempText;

        // Optionally, you can add logic to change the unit type based on the card
        // For example, if the unit is a refrigerator, set the unitType input accordingly
        // document.getElementById('unitType').value = 'Refrigerator'; // or 'AC'
    };

    // Function to show the add unit modal
    window.showAddUnitModal = function(unitType) {
        // Logic to open a modal or prompt for adding a new unit
        alert(`Add a new ${unitType} unit!`); // Placeholder for actual modal logic
    };
}); 