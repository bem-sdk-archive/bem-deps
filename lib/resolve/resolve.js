import Entity from '../bem/bem-entity';
import DependencyGraph from './dependency-graph';
import TechEntityMap from './tech-entity-map';

/**
 *
 * @param {*} obj
 * @returns {Boolean}
 */
function isRelation(obj) {
    return typeof obj === 'object' && obj.entity && obj.dependOn;
}

/**
 * Supplements the declaration with missing entities.
 *
 * **Important:** It takes into account the order dependencies of BEM-entities.
 *
 * @param {Object[]} declaration — List of BEM-entities. Each item is Object.
 *                                 See, [bem-naming]{@link https://github.com/bem/bem-naming}.
 * @param {Object[]} relations — List of dependencies between BEM-entities. Each item is Object with fields:
 *                               * {Object}   entity   — BEM-entity that is dependent on other.
 *                               * {String}   tech     — Technology of entity.
 *                               * {Object[]} dependOn — List of BEM-entities of which depends on entity.
 *                                 Each item is Object with fields:
 *                                   * {Object}         entity — BEM-entity of which depends entity.
 *                                   * {String}         tech   — Technology of entity.
 *                                   * {Boolean|String} order  — Depending provides information about the order:
 *                                     * `dependenceBeforeDependants` — BEM-entity may require that
 *                                                                      the other BEM-entity will be before it.
 *                                     * `false` — BEM-entity may expect that the other BEM-entity
 *                                                 will be before or after it.
 * @param {Object} [options]
 * @param {String} [options.tech] - technology for which need to take into account dependencies.
 * @returns {Object[]} Supplemented ordered declaration.
 * @example <caption>Unordered dependencies</caption>
 * import { resolve } from 'bem-deps';
 *
 * var declaration = [{ block: 'page' }];
 * var relations = {
 *     entity: { block: 'page' },
 *     dependOn: [
 *         { entity: { block: 'page', elem: 'css' } },
 *         { entity: { block: 'page', elem: block: 'js' } }
 *     ]
 * };
 *
 * resolve(declaration, relations);
 * // {
 * //     entities: [{ block: 'page' }, { block: 'page', elem: 'css' }, { block: 'page', elem: block: 'js' }],
 * //     dependOn: []
 * // }
 * @example <caption>Ordered dependencies</caption>
 * import { resolve } from 'bem-deps';
 *
 * var declaration = [{ block: 'button' }];
 * var relations = {
 *     entity: { block: 'button' },
 *     dependOn: [{
 *         entity: { block: 'control' },
 *         order: 'dependenceBeforeDependants'
 *     }]
 * };
 *
 * resolve(declaration, relations);
 * // {
 * //     entities: [{ block: 'control' }, { block: 'button' }],
 * //     dependOn: []
 * // }
 @example <caption>Dependencies between technologies</caption>
 * import { resolve } from 'bem-deps';
 *
 * var declaration = [{ block: 'attach' }];
 * var relations = {
 *     entity: { block: 'attach' },
 *     tech: 'js',
 *     dependOn: [{
 *         entity: { block: 'button' },
 *         tech: 'bemhtml'
 *     }]
 * };
 *
 * resolve(declaration, relations, { tech: 'js' });
 * // {
 * //     entities: [{ block: 'attach' }],
 * //     tech: 'js',
 * //     dependOn: [{
 * //         tech: 'bemhtml',
 * //         entities: [{ block: 'button' }]
 * //     }]
 * // }
 */
export default function resolve(declaration=[], relations=[], options={}) {
    if (!Array.isArray(relations)) {
        if (isRelation(relations)) {
            relations = [relations];
        } else if (arguments.length === 2) {
            options = relations;
            relations = [];
        }
    }

    if (typeof options === 'string') {
        options = { tech: options };
    }

    var dependencyGraph = new DependencyGraph(),
        techDependencyMap = new TechEntityMap(),
        // Technology that we want to build.
        requiredTech = options.tech;

    // Some entities from `declaration` may not have dependencies.
    // So add nodes of graph. It will be useful to correct generate BEM native dependencies need.
    for (let entity of declaration) {
        dependencyGraph.addEntity(new Entity(entity));
    }

    // разбираем
    for (let relation of relations) {
        var dependantEntity = new Entity(relation.entity),
            dependantTech = relation.tech;

        // Important: if `relation` doesn't have `tech` field then it means that each technology of `relation.entity`
        // depends on `relation.dependOn`.
        if (dependantTech) {
            // Ignore dependencies of non-required technology.
            // For example you build CSS, then you do not need to know about dependencies for JavaScript.
            if (dependantTech !== requiredTech) continue;
        } else {
            // Each technology of dependant entity depends on `relation.dependOn`, but we need only required technology.
            // Therefore, if user specified required technology, refine dependant technology.
            dependantTech = requiredTech;
        }

        for (let dependency of relation.dependOn) {
            var dependencyEntity = new Entity(dependency.entity),
                // If `dependency` doesn't have `tech` field then it means that each technology of `dependency.entity`
                // is dependency of `dependantTech`, but we need only required technology.
                // Therefore if user specified required technology, refine dependency technology.
                dependencyTech = dependency.tech || requiredTech;

            // Separate dependencies between different technologies from dependencies for required technology.
            if (dependantTech === dependencyTech) {
                dependencyGraph.addDependency(dependantEntity, dependencyEntity, dependency.order);
            } else {
                techDependencyMap.add(dependencyTech, dependencyEntity);
            }
        }
    }

    //
    //
    //
    // dependencyGraph.generateBemNativeDependencies();

    return {
        entities: dependencyGraph.dependenciesOf(declaration),
        dependOn: techDependencyMap.toArray()
    };
}
