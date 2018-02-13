import { h, h as createElement } from './h';
import { cloneElement } from './clone-element';
import { Component } from './component';
import { render } from './render';
import { rerender } from './render-queue';
import options from './options';
import { createContext } from "./create-context";

export default {
	h,
	createElement,
	createContext,
	cloneElement,
	Component,
	render,
	rerender,
	options
};

export {
	h,
	createElement,
	createContext,
	cloneElement,
	Component,
	render,
	rerender,
	options
};
