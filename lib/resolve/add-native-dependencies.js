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
            block = bemTypifier._entityMap.get(blockId);

        for (let modifierDependency of dependencyGraph.orderedDependenciesOf(modifier)) {
            if (stringifyEntity(modifierDependency) === blockId) {
                dependencyGraph.addDependency(block, modifier, { order: 'blockBeforeBlockModifier' });
                break;
            }
        }
    }

    for (let modifier of bemTypifier.elementModificators()) {
        var element = { block: modifier.block, elem: modifier.elem },
            elementId = stringifyEntity(element);

        for (let modifierDependency of dependencyGraph.orderedDependenciesOf(modifier)) {
            if (stringifyEntity(modifierDependency) === elementId) {
                dependencyGraph.addDependency(element, modifier, { order: 'elementBeforeElementModifier' });
                break;
            }
        }
    }

    for (let element of bemTypifier.elements()) {
        var blockId = element.block,
            block = bemTypifier._entityMap.get(blockId);

        for (let elementDependency of dependencyGraph.orderedDependenciesOf(element)) {
            if (stringifyEntity(elementDependency) === blockId) {
                dependencyGraph.addDependency(block, element, { order: 'elementBeforeBlock' });
                break;
            }
        }
    }
};
