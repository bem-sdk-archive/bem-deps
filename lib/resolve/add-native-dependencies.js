import { stringify as stringifyEntity } from 'bem-naming';
import BemTypifier from './bem-typifier';

export default function addNativeDependencies(declaration, dependencyGraph) {
    var bemTypifier = new BemTypifier();

    for (let entity of dependencyGraph.entities()) {
        bemTypifier.typify(entity);
    }

    for (let entity of declaration) {
        bemTypifier.typify(entity);
    }

    for (let modifier of bemTypifier.blockModificators()) {
        var blockId = modifier.block,
            block = { block: blockId };

        var hasOrderedDependency = false;

        for (let modifierDependency of dependencyGraph.orderedDependenciesOf(modifier)) {
            if (stringifyEntity(modifierDependency) === blockId) {
                hasOrderedDependency = true;
                break;
            }
        }

        if (!hasOrderedDependency) {
            dependencyGraph.addDependency(modifier, block, { order: 'blockBeforeBlockModifier' });
        }
    }

    for (let booleanModifier of bemTypifier.blockModificators()) {
        if (booleanModifier.modVal === true) {
            var block = booleanModifier.block,
                elem = booleanModifier.elem,
                modName = booleanModifier.modName,
                ignoreVals = [];

            for (let modifierDependency of dependencyGraph.orderedDependenciesOf(booleanModifier)) {
                if (modifierDependency.block === block
                    && modifierDependency.elem === elem
                    && modifierDependency.modName === modName
                ) {
                    ignoreVals.push(modifierDependency.modVal);
                }
            }

            for (let modifier of bemTypifier.blockModificators()) {
                if (modifier.block === block
                    && modifier.elem === elem
                    && modifier.modName === modName
                    && ignoreVals.indexOf(modifier.modVal) === -1
                ) {
                    dependencyGraph.addDependency(modifier, booleanModifier, { order: 'blockBooleanModifierBeforeBlockModifier' });
                }
            }
        }
    }

    for (let modifier of bemTypifier.elementModificators()) {
        var element = { block: modifier.block, elem: modifier.elem },
            elementId = stringifyEntity(element);

        var hasOrderedDependency = false;

        for (let modifierDependency of dependencyGraph.orderedDependenciesOf(modifier)) {
            if (stringifyEntity(modifierDependency) === elementId) {
                hasOrderedDependency = true;
                break;
            }
        }

        if (!hasOrderedDependency) {
            dependencyGraph.addDependency(modifier, element, { order: 'elementBeforeElementModifier' });
        }
    }

    for (let booleanModifier of bemTypifier.elementModificators()) {
        if (booleanModifier.modVal === true) {
            var block = booleanModifier.block,
                elem = booleanModifier.elem,
                modName = booleanModifier.modName,
                ignoreVals = [];

            for (let modifierDependency of dependencyGraph.orderedDependenciesOf(booleanModifier)) {
                if (modifierDependency.block === block
                    && modifierDependency.elem === elem
                    && modifierDependency.modName === modName
                ) {
                    ignoreVals.push(modifierDependency.modVal);
                }
            }

            for (let modifier of bemTypifier.elementModificators()) {
                if (modifier.block === block
                    && modifier.elem === elem
                    && modifier.modName === modName
                    && ignoreVals.indexOf(modifier.modVal) === -1
                ) {
                    dependencyGraph.addDependency(modifier, booleanModifier, { order: 'elementBooleanModifierBeforeElementModifier' });
                }
            }
        }
    }

    for (let modifier of bemTypifier.elementModificators()) {
        var blockId = modifier.block,
            block = { block: blockId };

        var hasOrderedDependency = false;

        for (let modifierDependency of dependencyGraph.orderedDependenciesOf(modifier)) {
            if (stringifyEntity(modifierDependency) === blockId) {
                hasOrderedDependency = true;
                break;
            }
        }

        if (!hasOrderedDependency) {
            dependencyGraph.addDependency(modifier, block, { order: 'blockBeforeElementModifier' });
        }
    }

    for (let element of bemTypifier.elements()) {
        var blockId = element.block,
            block = { block: blockId };

        var hasOrderedDependency = false;

        for (let elementDependency of dependencyGraph.orderedDependenciesOf(element)) {
            if (stringifyEntity(elementDependency) === blockId) {
                hasOrderedDependency = true;
                break;
            }
        }

        if (!hasOrderedDependency) {
            dependencyGraph.addDependency(element, block, { order: 'elementBeforeBlock' });
        }
    }
};
