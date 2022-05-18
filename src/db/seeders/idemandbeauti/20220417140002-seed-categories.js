'use strict';

const { v4: uuidv4} = require('uuid');

module.exports = {
	up: queryInterface => {
		return queryInterface.bulkInsert(
			'Categories',
			[
				{
					id: uuidv4(),
					name: 'brushes',
					description: 'brushes',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: uuidv4(),
					name: 'rags',
					description: 'rags',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: uuidv4(),
					name: 'skin cream',
					description: 'skin cream',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: uuidv4(),
					name: 'dyes',
					description: 'dyes',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: uuidv4(),
					name: 'palettes',
					description: 'palettes',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: uuidv4(),
					name: 'shampoo',
					description: 'shampoo',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{}
		);
	},

	down: queryInterface => {
		return queryInterface.bulkDelete('Categories', null, {});
	},
};
