const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
    const { title, tags, body } = request.payload;

    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newNote = {
        title, tags, body, id, createdAt, updatedAt
    };

    notes.push(newNote);

    const isSuccess = notes.filter((note) => note.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Status berhasil ditambahkan',
            data: {
                noteId: id,
            },
        });
        response.code(201);
        return response;
    }

    const response = h.response({
        status: 'Fail',
        message: 'Gagal menambahkan status',
    });
    response.code(500);
    return response;
};

const getNoteHandler = () => ({
    status: 'success',
    data: {
        notes,
    },
});

const getNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    const note = notes.filter((n) => n.id === id)[0];

    if (note !== undefined) {
        return {
            status: 'success',
            data: {
                note,
            },
        };
    }

    const resp = h.response({
        status: 'Fail',
        message: 'Catatan tidak ditemukan'
    });
    resp.code(404);
    return resp;
};

const editNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    const { title, tags, body } = request.payload;
    const updatedAt = new Date().toISOString();

    const index = notes.findIndex((note) => note.id === id);

    if (index !== -1) {
        notes[index] = {
            ...notes[index],
            title,
            tags,
            body,
            updatedAt,
        };

        const resp = h.response({
            status: 'success',
            data: 'Catatan berhasil diperbarui',
        });
        resp.code(200);
        return resp;
    }

    const resp = h.response({
        status: 'Fail',
        message: 'Gagal memperbarui catatan. Id tidak ditemukan',
    });
    resp.code(404);
    return resp;
};

const deleteNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    const index = notes.findIndex((note) => note.id === id);

    if (index !== -1) {
        notes.splice(index, 1);
        
        const resp = h.response({
            status: 'success',
            message: 'Catatan berhasil dihapus',
        });
        resp.code(200);
        return resp;
    };

    const resp = h.response({
        status: 'Fail',
        message: 'Gagal menghapus catatan. Id tidak ditemukan',
    });
    resp.code(404);
    return resp;
}

module.exports = {
    addNoteHandler,
    getNoteHandler,
    getNoteByIdHandler,
    editNoteByIdHandler,
    deleteNoteByIdHandler
};