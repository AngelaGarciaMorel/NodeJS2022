// permisos de administrador MIDDLEWARES
export const esAdmin = true

export function crearErrorNoEsAdmin(ruta, metodo) {
    const error = {
        error: 1,
    }
    if (ruta && metodo) {
        error.routerProducts= `ruta '${ruta}' metodo '${metodo}' no autorizado`;
    } else {
        error.descripcion = 'no autorizado';
    }
    return error;
}

export function soloAdmins(req, res, next) {
    if (!esAdmin) {
        res.json(crearErrorNoEsAdmin());
    } else {
        next();
    } 
}