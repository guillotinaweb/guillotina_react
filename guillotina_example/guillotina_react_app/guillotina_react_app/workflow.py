guillotina_simple = {
    "initial_state": "private",
    "states": {
        "pending": {
            "actions": {
                "publish": {
                    "title": "Publish",
                    "to": "published",
                    "check_permission": "guillotina.ReviewContent",
                },
                "reject": {
                    "title": "Send back",
                    "to": "private",
                    "check_permission": "guillotina.ReviewContent",
                },
                "retract": {
                    "title": "Retract",
                    "to": "private",
                    "check_permission": "guillotina.RequestReview",
                },
            },
            "set_permission": {
                "perminhe": [
                    {
                        "setting": "Deny",
                        "permission": "guillotina.AccessContent",
                    },
                    {
                        "setting": "Deny",
                        "permission": "guillotina.ModifyContent",
                    },
                    {
                        "setting": "Deny",
                        "permission": "guillotina.ViewContent",
                    },
                ],
                "roleperm": [
                    {
                        "setting": "Allow",
                        "permission": "guillotina.AccessContent",
                        "role": "guillotina.Manager",
                    },
                    {
                        "setting": "Allow",
                        "permission": "guillotina.AccessContent",
                        "role": "guillotina.Owner",
                    },
                    {
                        "setting": "Allow",
                        "permission": "guillotina.AccessContent",
                        "role": "guillotina.Editor",
                    },
                    {
                        "setting": "Allow",
                        "permission": "guillotina.AccessContent",
                        "role": "guillotina.Reader",
                    },
                    {
                        "setting": "Allow",
                        "permission": "guillotina.AccessContent",
                        "role": "guillotina.Reviewer",
                    },
                    {
                        "setting": "Allow",
                        "permission": "guillotina.AccessContent",
                        "role": "guillotina.ContainerAdmin",
                    },
                    {
                        "setting": "Allow",
                        "permission": "guillotina.ModifyContent",
                        "role": "guillotina.Reviewer",
                    },
                    {
                        "setting": "Allow",
                        "permission": "guillotina.ModifyContent",
                        "role": "guillotina.ContainerAdmin",
                    },
                    {
                        "setting": "Allow",
                        "permission": "guillotina.ModifyContent",
                        "role": "guillotina.Manager",
                    },
                    {
                        "setting": "Allow",
                        "permission": "guillotina.ViewContent",
                        "role": "guillotina.Manager",
                    },
                    {
                        "setting": "Allow",
                        "permission": "guillotina.ViewContent",
                        "role": "guillotina.Owner",
                    },
                    {
                        "setting": "Allow",
                        "permission": "guillotina.ViewContent",
                        "role": "guillotina.Editor",
                    },
                    {
                        "setting": "Allow",
                        "permission": "guillotina.ViewContent",
                        "role": "guillotina.Reader",
                    },
                    {
                        "setting": "Allow",
                        "permission": "guillotina.ViewContent",
                        "role": "guillotina.Reviewer",
                    },
                    {
                        "setting": "Allow",
                        "permission": "guillotina.ViewContent",
                        "role": "guillotina.ContainerAdmin",
                    },
                ],
            },
        },
        "private": {
            "actions": {
                "publish": {
                    "title": "Publish",
                    "to": "published",
                    "check_permission": "guillotina.ReviewContent",
                },
                "submit": {
                    "title": "Submit",
                    "to": "pending",
                    "check_permission": "guillotina.RequestReview",
                },
            },
            "set_permission": {
                "perminhe": [
                    {
                        "setting": "Deny",
                        "permission": "guillotina.AccessContent",
                    },
                    {
                        "setting": "Deny",
                        "permission": "guillotina.ModifyContent",
                    },
                    {
                        "setting": "Deny",
                        "permission": "guillotina.ViewContent",
                    },
                ],
                "roleperm": [
                    {
                        "setting": "Allow",
                        "permission": "guillotina.AccessContent",
                        "role": "guillotina.Manager",
                    },
                    {
                        "setting": "Allow",
                        "permission": "guillotina.AccessContent",
                        "role": "guillotina.Owner",
                    },
                    {
                        "setting": "Allow",
                        "permission": "guillotina.AccessContent",
                        "role": "guillotina.Editor",
                    },
                    {
                        "setting": "Allow",
                        "permission": "guillotina.AccessContent",
                        "role": "guillotina.Reader",
                    },
                    {
                        "setting": "Allow",
                        "permission": "guillotina.AccessContent",
                        "role": "guillotina.ContainerAdmin",
                    },
                    {
                        "setting": "Allow",
                        "permission": "guillotina.ModifyContent",
                        "role": "guillotina.Owner",
                    },
                    {
                        "setting": "Allow",
                        "permission": "guillotina.ModifyContent",
                        "role": "guillotina.ContainerAdmin",
                    },
                    {
                        "setting": "Allow",
                        "permission": "guillotina.ModifyContent",
                        "role": "guillotina.Manager",
                    },
                    {
                        "setting": "Allow",
                        "permission": "guillotina.ModifyContent",
                        "role": "guillotina.Editor",
                    },
                    {
                        "setting": "Allow",
                        "permission": "guillotina.ViewContent",
                        "role": "guillotina.Manager",
                    },
                    {
                        "setting": "Allow",
                        "permission": "guillotina.ViewContent",
                        "role": "guillotina.Owner",
                    },
                    {
                        "setting": "Allow",
                        "permission": "guillotina.ViewContent",
                        "role": "guillotina.Editor",
                    },
                    {
                        "setting": "Allow",
                        "permission": "guillotina.ViewContent",
                        "role": "guillotina.Reader",
                    },
                    {
                        "setting": "Allow",
                        "permission": "guillotina.ViewContent",
                        "role": "guillotina.ContainerAdmin",
                    },
                ],
            },
        },
        "published": {
            "actions": {
                "retract_pending": {
                    "title": "Back to review",
                    "to": "pending",
                    "check_permission": "guillotina.ReviewContent",
                },
                "reject": {
                    "title": "Send back",
                    "to": "private",
                    "check_permission": "guillotina.ReviewContent",
                },
                "retract": {
                    "title": "Retract",
                    "to": "private",
                    "check_permission": "guillotina.RequestReview",
                },
            },
            "set_permission": {
                "perminhe": [
                    {
                        "setting": "Deny",
                        "permission": "guillotina.AccessContent",
                    },
                    {
                        "setting": "Deny",
                        "permission": "guillotina.ModifyContent",
                    },
                    {
                        "setting": "Deny",
                        "permission": "guillotina.ViewContent",
                    },
                ],
                "roleperm": [
                    {
                        "setting": "Allow",
                        "permission": "guillotina.AccessContent",
                        "role": "guillotina.Anonymous",
                    },
                    {
                        "setting": "Allow",
                        "permission": "guillotina.ModifyContent",
                        "role": "guillotina.Owner",
                    },
                    {
                        "setting": "Allow",
                        "permission": "guillotina.ModifyContent",
                        "role": "guillotina.ContainerAdmin",
                    },
                    {
                        "setting": "Allow",
                        "permission": "guillotina.ModifyContent",
                        "role": "guillotina.Manager",
                    },
                    {
                        "setting": "Allow",
                        "permission": "guillotina.ModifyContent",
                        "role": "guillotina.Editor",
                    },
                    {
                        "setting": "Allow",
                        "permission": "guillotina.ViewContent",
                        "role": "guillotina.Anonymous",
                    },
                ],
            },
        },
    },
}

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
