// -*- mode: typescript; indent-tabs-mode: nil; js-basic-offset: 4 -*-
//
// Copyright 2017-2020 Giovanni Campagna <gcampagn@cs.stanford.edu>
//
// See LICENSE for details

import * as smt from './smtlib';

export type SatResult = {
    satisfieable: boolean,
    model: Record<string,number|boolean>|undefined
}

export default class BaseSmtSolver {
    private _statements : smt.SNode[];
    withAssignments : boolean;
    timeLimit : number;

    constructor(logic = 'QF_ALL_SUPPORTED') {
        this._statements = [
            smt.SetLogic(logic)
        ];


        this.withAssignments = false;
        this.timeLimit = 180000;
    }

    enableAssignments() : void {
        this.withAssignments = true;
        this.add(smt.SetOption('produce-assignments'));
        this.add(smt.SetOption('produce-models'));
    }

    dump() : void {
        for (const stmt of this._statements)
            console.log(stmt.toString());

    }

    forEachStatement(callback : (cb : smt.SNode, idx : number) => void) : void {
        this._statements.forEach(callback);
    }

    checkSat() : Promise<SatResult> {
        throw new Error('checkSat not implemented for this solver');
    }

    add(stmt : smt.SNode) : void {
        this._statements.push(stmt);
    }

    assert(expr : smt.SNode) : void {
        this.add(smt.Assert(expr));
    }

    setOption(opt : string, value : smt.SNode = 'true') : void {
        this.add(smt.SetOption(opt, value));
    }

    declareFun(name : string, args : smt.SNode[], type : smt.SNode) : void {
        this.add(smt.DeclareFun(name, args, type));
    }
}
