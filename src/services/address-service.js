import { prismaClient } from '../application/connection.js';
import { ResponseError } from '../errors/response-error.js';
import {
	createAddressValidation,
	getAddressValidation,
	updateAddressValidation
} from '../validations/address-validation.js';
import { getContactValidation } from '../validations/contact-validation.js';
import { validate } from '../validations/validation.js';

const checkCountactMustExists = async (user, contactId) => {
	contactId = validate(getContactValidation, contactId);

	const countContact = await prismaClient.contact.count({
		where: {
			username: user.username,
			id: contactId
		}
	});
	if (countContact !== 1) {
		throw new ResponseError(404, 'contact is not found');
	}
	return contactId;
};

const createAddress = async (user, contactId, request) => {
	contactId = await checkCountactMustExists(user, contactId);

	const address = validate(createAddressValidation, request);
	address.contact_id = contactId;

	return prismaClient.address.create({
		data: address,
		select: {
			id: true,
			street: true,
			city: true,
			province: true,
			country: true,
			postal_code: true
		}
	});
};

const getAddress = async (user, contactId, addressId) => {
	contactId = await checkCountactMustExists(user, contactId);
	addressId = validate(getContactValidation, addressId);

	const address = await prismaClient.address.findFirst({
		where: {
			contact_id: contactId,
			id: addressId
		},
		select: {
			id: true,
			street: true,
			city: true,
			province: true,
			country: true,
			postal_code: true
		}
	});
	if (!address) {
		throw new ResponseError(404, 'address is not found');
	}
	return address;
};

const updateAddress = async (user, contactId, request) => {
	contactId = await checkCountactMustExists(user, contactId);
	const address = validate(updateAddressValidation, request);

	const countAddress = await prismaClient.address.count({
		where: {
			contact_id: contactId,
			id: address.id
		}
	});
	if (countAddress !== 1) {
		throw new ResponseError(404, 'address is not found');
	}
	return prismaClient.address.update({
		where: {
			id: address.id
		},
		data: {
			street: address.street,
			city: address.city,
			province: address.province,
			country: address.country,
			postal_code: address.postal_code
		},
		select: {
			id: true,
			street: true,
			city: true,
			province: true,
			country: true,
			postal_code: true
		}
	});
};

const removeAddress = async (user, contactId, addressId) => {
	contactId = await checkCountactMustExists(user, contactId);
	addressId = validate(getAddressValidation, addressId);

	const countAddress = await prismaClient.address.count({
		where: {
			contact_id: contactId,
			id: addressId
		}
	});
	if (countAddress !== 1) {
		throw new ResponseError(404, 'address is not found');
	}
	return prismaClient.address.delete({
		where: {
			id: addressId
		}
	});
};

const listAddress = async (user, contactId) => {
	contactId = await checkCountactMustExists(user, contactId);

	return prismaClient.address.findMany({
		where: {
			contact_id: contactId
		},
		select: {
			id: true,
			street: true,
			city: true,
			province: true,
			country: true,
			postal_code: true
		}
	});
};
export default { createAddress, getAddress, updateAddress, removeAddress, listAddress };
