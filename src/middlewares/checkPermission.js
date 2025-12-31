import Response from "../../helpers/response.js";

export const formatModuleName = (str) =>
{
    if (!str) return "";
    return str
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

export const checkPermission = (moduleName, action, mode) =>
{
    return (req, res, next) =>
    {
        if (req.user.roleId === 0 && req.user.id === 1)
        {
            return next();
        }

        try
        {
            const permissions = req.user.permissions || {};
            const modulePermissions = permissions[moduleName];

            if (modulePermissions && modulePermissions[action] === "on")
            {
                return next();
            }

            const formattedModuleName = formatModuleName(moduleName);
            const deniedMessage = `Permission for '${action}' is denied for '${formattedModuleName}'`;

            return mode
                ? res.json(Response.failure(deniedMessage))
                : res.render("permissionDenied", {
                    deniedModules: [formattedModuleName],
                    deniedMessage
                });

        } catch (err)
        {
            console.error("Permission check error:", err);

            return mode
                ? res.json(Response.failure("Error while checking permission"))
                : res.render("permissionDenied");
        }
    };
};
