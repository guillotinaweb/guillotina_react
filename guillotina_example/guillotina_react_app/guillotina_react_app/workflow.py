guillotina_basic_with_translations = {
    "initial_state": "private",
    "states": {
        "private": {
            "metadata": {
                "title": "Private",
                "translated_title": {
                    "en": "Private",
                    "ca": "Privat",
                    "es": "Privado",
                },
            },
            "actions": {
                "publish": {
                    "title": "Publish",
                    "metadata": {
                        "translated_title": {
                            "en": "Publish",
                            "ca": "Publicar",
                            "es": "Publicar",
                        },
                    },
                    "to": "public",
                    "check_permission": "guillotina.ReviewContent",
                }
            },
            "set_permission": {
                "roleperm": [
                    {
                        "setting": "Deny",
                        "role": "guillotina.Anonymous",
                        "permission": "guillotina.ViewContent",
                    },
                    {
                        "setting": "Deny",
                        "role": "guillotina.Anonymous",
                        "permission": "guillotina.AccessContent",
                    },
                    {
                        "setting": "Deny",
                        "role": "guillotina.Anonymous",
                        "permission": "guillotina.SearchContent",
                    },
                ]
            },
        },
        "public": {
            "metadata": {
                "title": "Public",
                "translated_title": {
                    "en": "Public",
                    "ca": "Públic",
                    "es": "Público",
                },
            },
            "actions": {
                "retire": {
                    "title": "Retire",
                    "metadata": {
                        "translated_title": {
                            "en": "Retire",
                            "ca": "Retirar",
                            "es": "Retirar",
                        },
                    },
                    "to": "private",
                    "check_permission": "guillotina.ReviewContent",
                },
            },
            "set_permission": {
                "roleperm": [
                    {
                        "setting": "AllowSingle",
                        "role": "guillotina.Anonymous",
                        "permission": "guillotina.ViewContent",
                    },
                    {
                        "setting": "AllowSingle",
                        "role": "guillotina.Anonymous",
                        "permission": "guillotina.AccessContent",
                    },
                    {
                        "setting": "AllowSingle",
                        "role": "guillotina.Anonymous",
                        "permission": "guillotina.SearchContent",
                    },
                ]
            },
        },
    },
}
