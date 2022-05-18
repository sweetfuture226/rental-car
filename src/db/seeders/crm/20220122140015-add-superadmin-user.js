'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
	up: async queryInterface => {
    const passwordHash = await bcrypt.hash('Alliance#124', 10);
		return queryInterface.bulkInsert(
			'Admins',
			[
				{
          id: 'a0ece5db-cd14-4f21-812f-966633e7be86',
					firstName: 'Alliance',
          lastName: 'SuperAdmin',
          email: 'superadmin@alliancedevelopment.com',
          phone: '+1 (917) 585-3181',
          password: passwordHash,
          roleId: 1,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{}
		);
	},

	down: queryInterface => {
		return queryInterface.bulkDelete('Admins', null, {});
	},
};
