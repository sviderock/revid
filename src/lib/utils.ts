import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { WSServerEvent } from '../wsServer';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function parseJson<T extends object>(str: string): T | null {
	try {
		return JSON.parse(str) as T;
	} catch (error) {
		console.error('issue parsing JSON', error);
		return null;
	}
}

export function encodeJson<T extends object>(obj: T) {
	try {
		return JSON.stringify(obj);
	} catch (error) {
		console.error('issue encoding JSON', error);
		return '';
	}
}

export function encodeEvent<T extends WSServerEvent>(event: T) {
	return encodeJson(event);
}

export function persistData<T extends object>(key: string, data: T) {
	try {
		localStorage.setItem(key, JSON.stringify(data));
	} catch (error) {
		console.error(error);
	}
}

export function getPersistedData<T extends object>(key: string): T | null {
	try {
		const data = localStorage.getItem(key);
		if (!data) return null;
		return JSON.parse(data) as T;
	} catch (error) {
		console.error(error);
		return null;
	}
}

export function getWsUrl(location: Location) {
	return `${location.protocol === 'https:' ? 'wss' : 'ws'}://localhost:3001`;
}

export async function fetchPost<R extends object, T extends object = object>(
	url: string,
	body?: T,
) {
	const resp = await fetch(url, { method: 'POST', body: body ? encodeJson(body) : undefined });
	return (await resp.json()) as R;
}

export async function fetchGet<
	R extends object,
	T extends Record<string, string | number | boolean | null | undefined> = Record<
		string,
		string | number | boolean | null | undefined
	>,
>(url: string, params?: T) {
	let searchStr = '';
	if (params) {
		const searchParams = new URLSearchParams();
		for (const key in params) {
			searchParams.append(key, `${params[key]}`);
		}

		searchStr = searchParams.toString() ? `?${searchParams.toString()}` : '';
	}

	const resp = await fetch(`${url}${searchStr}`);
	return (await resp.json()) as R;
}
