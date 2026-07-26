/*!
 * This file is part of @lusc/truth-table, a logic parser and table generator.
 * Copyright (C) 2026, Luca Schnellmann <oss@lusc.ch>

 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

// The symbols used in the stringified output
export enum OperatorSymbols {
	iff = '⟷',
	ifthen = '→',
	not = '¬',
	and = '∧',
	nand = '⊼',
	xor = '↮',
	or = '∨',
	nor = '⊽',
}

export enum Operator {
	iff = 'iff',
	ifthen = 'ifthen',
	not = 'not',
	and = 'and',
	nand = 'nand',
	xor = 'xor',
	or = 'or',
	nor = 'nor',
}
