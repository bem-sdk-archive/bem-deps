import test from 'ava';

it('should return result containing entities sections', t => {
    const data = graph.dependenciesOf();

    t.ok(data.entities);
});

it('should return result containing depsByTech sections', t => {
    const data = graph.dependenciesOf();

    t.ok(data.depsByTech);
});

it('should return empty depsByTech if decl is not specified or empty', t => {
    const data = graph.dependenciesOf();

    t.same(data.depsByTech, {});
});

it('should return empty depsByTech for any decl', function () {
    const decl = [{ block: 'A' }];
    const data = graph.dependenciesOf(decl);

    t.same(data.depsByTech, {});
});
