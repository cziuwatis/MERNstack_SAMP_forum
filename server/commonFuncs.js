

export function getNextSequenceValue(schema, sequenceName) {

    let sequenceDocument = schema.findAndModify({
        query: {_id: sequenceName},
        update: {$inc: {sequence_value: 1}},
        new : true
    });

    return sequenceDocument.sequence_value;
}