function calculateMonthlyUsers(users) {
    const monthlyLoggedInUsers = {};
    const monthlyActiveUsers = {};

    users.forEach(user => {
        const loggedInDate = new Date(user.logged_in);
        const loggedOutDate = new Date(user.logged_out);
        const lastOpenedDate = new Date(user.lastOpenedAt);

        const loggedInYearMonth = `${loggedInDate.getFullYear()}-${loggedInDate.getMonth() + 1}`;
        const loggedOutYearMonth = `${loggedOutDate.getFullYear()}-${loggedOutDate.getMonth() + 1}`;
        const lastOpenedYearMonth = `${lastOpenedDate.getFullYear()}-${lastOpenedDate.getMonth() + 1}`;

        // For Tracking logged-in users per month
        if (!monthlyLoggedInUsers[loggedInYearMonth]) {
            monthlyLoggedInUsers[loggedInYearMonth] = new Set();
        }
        monthlyLoggedInUsers[loggedInYearMonth].add(user.userId);

        // If the user log out is in a different month, and is tracked across months
        if (loggedOutYearMonth !== loggedInYearMonth) {
            let tempDate = new Date(loggedInDate);
            while (tempDate <= loggedOutDate) {
                const tempYearMonth = `${tempDate.getFullYear()}-${tempDate.getMonth() + 1}`;
                if (!monthlyLoggedInUsers[tempYearMonth]) {
                    monthlyLoggedInUsers[tempYearMonth] = new Set();
                }
                monthlyLoggedInUsers[tempYearMonth].add(user.userId);
                tempDate.setMonth(tempDate.getMonth() + 1);
            }
        }

        // Tracking active users each month
        if (!monthlyActiveUsers[lastOpenedYearMonth]) {
            monthlyActiveUsers[lastOpenedYearMonth] = new Set();
        }
        monthlyActiveUsers[lastOpenedYearMonth].add(user.userId);
    });

    const monthlyMetrics = Object.keys(monthlyLoggedInUsers).map(month => {
        return {
            month,
            loggedInUsers: monthlyLoggedInUsers[month].size,
            activeUsers: monthlyActiveUsers[month] ? monthlyActiveUsers[month].size : 0
        };
    });

    return monthlyMetrics;
}

// Example: 
const users = [
    {
        deviceId: 'device1',
        userId: 'user1',
        logged_in: '2023-01-15',
        logged_out: '2023-03-10',
        lastOpenedAt: '2023-02-05'
    },
    {
        deviceId: 'device2',
        userId: 'user2',
        logged_in: '2023-02-01',
        logged_out: '2023-04-15',
        lastOpenedAt: '2023-03-20'
    }
];

console.log(calculateMonthlyUsers(users));
