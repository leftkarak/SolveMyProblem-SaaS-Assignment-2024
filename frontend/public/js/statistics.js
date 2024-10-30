// Function to extract the ideal format for Dates
function extractDate(isoDateTime) {
    return isoDateTime.split('T')[0];
}

// Function to calculate all dates between two given dates
function getAllDatesBetween(startDate, endDate) {
    let dates = [];
    let currentDate = new Date(startDate);
    const lastDate = new Date(endDate);

    while (currentDate <= lastDate) {
        dates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1); // Increment day
    }

    return dates;
}

// Function to calculate submissions per day and fill in zeros for missing days
function calculateSubmissionsPerDay(data, startDate, endDate) {
    const submissionsPerDay = {};

    // Initialize all dates with zero submissions
    getAllDatesBetween(startDate, endDate).forEach(date => {
        submissionsPerDay[date] = 0;
    });

    // Count actual submissions for each date within the range
    data.logs.forEach(submission => {
        const submissionDate = extractDate(submission.execution_date);
        if (submissionDate >= startDate && submissionDate <= endDate) {
            submissionsPerDay[submissionDate]++;
        }
    });

    return submissionsPerDay;
}

// Function to adjust the date for a given period (week, month, etc.)
function getDateForPeriod(data, period) {
    const date = new Date(today);

    switch (period) {
        case 'week':
            date.setDate(today.getDate() - 7);
            break;
        case 'month':
            date.setMonth(today.getMonth() - 1);
            break;
        case 'three-months':
            date.setMonth(today.getMonth() - 3);
            break;
        default:
            // 'all' case: return the earliest submission date
            const dates = data.logs.map(submission => extractDate(submission.execution_date));
            return new Date(Math.min(...dates.map(d => new Date(d))));
    }

    return date;
}

// Function to display chart
// function displaySubmissionsChart(submissionsPerDay) {
function displaySubmissionsChart(submissionsPerDay) {
    const dates = Object.keys(submissionsPerDay);
    const submissionCounts = Object.values(submissionsPerDay);

    const ctx = document.getElementById('submissionPerDay').getContext('2d');

    if (window.myChart) {
        window.myChart.destroy();  // Destroy previous chart instance to avoid overlap
    }
    window.myChart = new Chart(ctx, {
        type: 'line', // Line chart
        data: {
            labels: dates,
            datasets: [{
                label: 'Number of Submissions',
                data: submissionCounts,
                fill: true, // Enable fill color
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Color fill between line and x-axis
                borderWidth: 2,
                tension: 0.1, // Smooth the line
                pointRadius: 0 // Disable bullets on data points
            }]
        },
        options: {
            responsive: true,
            interaction: {
                mode: 'index',  // Show the tooltip at the index where the mouse is
                intersect: false  // Allow interaction even if the pointer is not exactly on the point
            },
            plugins: {
                tooltip: {
                    enabled: true, // Enable tooltip on hover
                    callbacks: {
                        label: function(tooltipItem) {
                            return `Submissions: ${tooltipItem.raw}`; // Customize the tooltip text
                        }
                    }
                }
            },
            hover: {
                mode: 'index',
                intersect: false
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Submissions Count'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                }
            }
        }
    });
}


// Function to filter data based on selected period (week, month, three-months, all)
function filterData(data, period) {
    const startDate = getDateForPeriod(data, period).toISOString().split('T')[0];
    const endDate = today.toISOString().split('T')[0];
    const submissionsPerDay = calculateSubmissionsPerDay(data, startDate, endDate);

    displaySubmissionsChart(submissionsPerDay);
}