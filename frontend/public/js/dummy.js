// JSON data (from your provided file)
const submissionData = {
    "logs": [
        { "email": "user1@example.com", "execution_duration": 45, "execution_date": "2024-09-30" },
        { "email": "user2@example.com", "execution_duration": 120, "execution_date": "2024-09-29" },
        { "email": "user3@example.com", "execution_duration": 30, "execution_date": "2024-09-28" },
        { "email": "user4@example.com", "execution_duration": 90, "execution_date": "2024-09-27" },
        { "email": "user5@example.com", "execution_duration": 60, "execution_date": "2024-09-26" },
        { "email": "user6@example.com", "execution_duration": 110, "execution_date": "2024-09-25" },
        { "email": "user7@example.com", "execution_duration": 75, "execution_date": "2024-09-24" },
        { "email": "user8@example.com", "execution_duration": 100, "execution_date": "2024-09-23" },
        { "email": "user9@example.com", "execution_duration": 50, "execution_date": "2024-09-22" },
        { "email": "user1@example.com", "execution_duration": 45, "execution_date": "2024-09-30" },
        { "email": "user2@example.com", "execution_duration": 120, "execution_date": "2024-09-29" },
        { "email": "user3@example.com", "execution_duration": 30, "execution_date": "2024-08-28" },
        { "email": "user4@example.com", "execution_duration": 90, "execution_date": "2024-09-27" },
        { "email": "user5@example.com", "execution_duration": 60, "execution_date": "2024-09-26" },
        { "email": "user6@example.com", "execution_duration": 110, "execution_date": "2024-09-25" },
        { "email": "user7@example.com", "execution_duration": 75, "execution_date": "2024-09-24" },
        { "email": "user8@example.com", "execution_duration": 100, "execution_date": "2024-09-23" },
        { "email": "user9@example.com", "execution_duration": 50, "execution_date": "2024-08-22" },
        { "email": "user1@example.com", "execution_duration": 45, "execution_date": "2024-09-30" },
        { "email": "user2@example.com", "execution_duration": 120, "execution_date": "2024-09-29" },
        { "email": "user3@example.com", "execution_duration": 30, "execution_date": "2024-09-28" },
        { "email": "user4@example.com", "execution_duration": 90, "execution_date": "2024-09-27" },
        { "email": "user5@example.com", "execution_duration": 60, "execution_date": "2024-09-26" },
        { "email": "user6@example.com", "execution_duration": 110, "execution_date": "2024-09-25" },
        { "email": "user7@example.com", "execution_duration": 75, "execution_date": "2024-09-24" },
        { "email": "user8@example.com", "execution_duration": 100, "execution_date": "2024-09-23" },
        { "email": "user9@example.com", "execution_duration": 50, "execution_date": "2024-09-22" },
        { "email": "user1@example.com", "execution_duration": 45, "execution_date": "2024-09-30" },
        { "email": "user2@example.com", "execution_duration": 120, "execution_date": "2024-09-29" },
        { "email": "user3@example.com", "execution_duration": 30, "execution_date": "2024-09-28" },
        { "email": "user4@example.com", "execution_duration": 90, "execution_date": "2024-09-27" },
        { "email": "user5@example.com", "execution_duration": 60, "execution_date": "2024-09-26" },
        { "email": "user6@example.com", "execution_duration": 110, "execution_date": "2024-09-25" },
        { "email": "user7@example.com", "execution_duration": 75, "execution_date": "2024-09-24" },
        { "email": "user8@example.com", "execution_duration": 100, "execution_date": "2024-08-24" },
        { "email": "user9@example.com", "execution_duration": 50, "execution_date": "2024-09-22" },
        { "email": "user1@example.com", "execution_duration": 45, "execution_date": "2024-09-30" },
        { "email": "user2@example.com", "execution_duration": 120, "execution_date": "2024-09-29" },
        { "email": "user3@example.com", "execution_duration": 30, "execution_date": "2024-09-28" },
        { "email": "user4@example.com", "execution_duration": 90, "execution_date": "2024-09-27" },
        { "email": "user5@example.com", "execution_duration": 60, "execution_date": "2024-08-26" },
        { "email": "user6@example.com", "execution_duration": 110, "execution_date": "2024-09-25" },
        { "email": "user7@example.com", "execution_duration": 75, "execution_date": "2024-09-24" },
        { "email": "user8@example.com", "execution_duration": 100, "execution_date": "2024-09-25" },
        { "email": "user9@example.com", "execution_duration": 50, "execution_date": "2024-09-22" },
        { "email": "user1@example.com", "execution_duration": 45, "execution_date": "2024-09-30" },
        { "email": "user2@example.com", "execution_duration": 120, "execution_date": "2024-09-29" },
        { "email": "user3@example.com", "execution_duration": 30, "execution_date": "2024-09-28" },
        { "email": "user4@example.com", "execution_duration": 90, "execution_date": "2024-09-27" },
        { "email": "user5@example.com", "execution_duration": 60, "execution_date": "2024-09-26" },
        { "email": "user6@example.com", "execution_duration": 110, "execution_date": "2024-09-25" },
        { "email": "user7@example.com", "execution_duration": 75, "execution_date": "2024-09-24" },
        { "email": "user8@example.com", "execution_duration": 100, "execution_date": "2024-09-26" },
        { "email": "user9@example.com", "execution_duration": 50, "execution_date": "2024-09-22" },
        { "email": "user3@example.com", "execution_duration": 30, "execution_date": "2024-09-28" },
        { "email": "user4@example.com", "execution_duration": 90, "execution_date": "2024-09-27" },
        { "email": "user5@example.com", "execution_duration": 60, "execution_date": "2024-09-26" },
        { "email": "user6@example.com", "execution_duration": 110, "execution_date": "2024-09-25" },
        { "email": "user7@example.com", "execution_duration": 75, "execution_date": "2024-07-24" },
        { "email": "user8@example.com", "execution_duration": 100, "execution_date": "2024-08-24" },
        { "email": "user9@example.com", "execution_duration": 50, "execution_date": "2024-09-22" },
        { "email": "user1@example.com", "execution_duration": 45, "execution_date": "2024-09-30" },
        { "email": "user2@example.com", "execution_duration": 120, "execution_date": "2024-09-29" },
        { "email": "user3@example.com", "execution_duration": 30, "execution_date": "2024-05-28" },
        { "email": "user4@example.com", "execution_duration": 90, "execution_date": "2024-09-27" },
        { "email": "user5@example.com", "execution_duration": 60, "execution_date": "2024-08-06" },
        { "email": "user6@example.com", "execution_duration": 110, "execution_date": "2024-09-25" },
        { "email": "user7@example.com", "execution_duration": 75, "execution_date": "2023-09-24" },
        { "email": "user8@example.com", "execution_duration": 100, "execution_date": "2024-09-25" },
        { "email": "user9@example.com", "execution_duration": 50, "execution_date": "2024-09-22" },
        { "email": "user1@example.com", "execution_duration": 45, "execution_date": "2023-09-30" },
        { "email": "user2@example.com", "execution_duration": 120, "execution_date": "2024-09-29" },
        { "email": "user3@example.com", "execution_duration": 30, "execution_date": "2024-09-28" },
        { "email": "user4@example.com", "execution_duration": 90, "execution_date": "2024-09-27" },
        { "email": "user5@example.com", "execution_duration": 60, "execution_date": "2024-09-26" },
        { "email": "user6@example.com", "execution_duration": 110, "execution_date": "2024-09-25" },
        { "email": "user7@example.com", "execution_duration": 75, "execution_date": "2024-09-25" },
        { "email": "user8@example.com", "execution_duration": 100, "execution_date": "2024-06-26" },
        { "email": "user9@example.com", "execution_duration": 50, "execution_date": "2024-09-22" },
        { "email": "user10@example.com", "execution_duration": 80, "execution_date": "2024-09-21" }
    ]
};

const today = new Date();

// Function to calculate all dates between two given dates
function getAllDatesBetweenDD(startDate, endDate) {
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
function calculateSubmissionsPerDayDD(startDate, endDate) {
    const submissionsPerDay = {};

    // Initialize all dates with zero submissions
    getAllDatesBetweenDD(startDate, endDate).forEach(date => {
        submissionsPerDay[date] = 0;
    });

    // Count actual submissions for each date within the range
    submissionData.logs.forEach(submission => {
        if (submission.execution_date >= startDate && submission.execution_date <= endDate) {
            submissionsPerDay[submission.execution_date]++;
        }
    });

    return submissionsPerDay;
}

// Function to adjust the date for a given period (week, month, etc.)
function getDateForPeriodDD(period) {
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
            const dates = submissionData.logs.map(submission => submission.execution_date);
            return new Date(Math.min(...dates.map(d => new Date(d))));
    }

    return date;
}

// Function to display chart
// function displaySubmissionsChart(submissionsPerDay) {
function displaySubmissionsChartDD(submissionsPerDay) {
    const dates = Object.keys(submissionsPerDay);
    const submissionCounts = Object.values(submissionsPerDay);

    const ctx = document.getElementById('submissionPerDayDD').getContext('2d');

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
function filterDataDD(period) {
    const startDate = getDateForPeriodDD(period).toISOString().split('T')[0];
    const endDate = today.toISOString().split('T')[0];
    const submissionsPerDay = calculateSubmissionsPerDayDD(startDate, endDate);

    displaySubmissionsChartDD(submissionsPerDay);
}