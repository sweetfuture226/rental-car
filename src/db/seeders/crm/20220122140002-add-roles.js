'use strict';

module.exports = {
	up: queryInterface => {
		return queryInterface.bulkInsert(
			'Roles',
			[
				{
					name: 'superadmin',
					applicationId: null,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					name: 'admin',
					applicationId: null,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					name: 'default',
					applicationId: null,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					name: 'appowner',
					applicationId: null,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{}
		);
	},

	down: queryInterface => {
		return queryInterface.bulkDelete('Roles', null, {});
	},
};
