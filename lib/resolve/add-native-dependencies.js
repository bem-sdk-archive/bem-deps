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
