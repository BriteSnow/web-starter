

## CSS Code Layout

- All css are eather in 
  - **web/src/pcss/** which are the global css for theapplication. It will be loaded first. In this folder there are the following structure and convention. 
    - **0_main.pcss** this is the top base css for the most common rules, like html, body, h1, a, ... It also includes the **mixins-all.pcss** and all of the **vars-*.pcss**
    - **mixins-all.pcss** include all of the **mixins-*.pcss**, and can be imported in all pcss that needs mixins.
    - **mixins-*.pcss** are mixins ONLY pcss files per domain. Elevation, Typography, and all. This is NOT were to put variables.
    - **vars-*.pcss** are where we have all of the css variables (the standard way with `--varName: value` in the `:root{   }`). All or these files are imported at the top of **0_main.pcss**
  - <strong>web/src/views/**/*.pcss</strong> are the pcss files for the view. They MUST have all their css rules nested in the `.ComponentName{ ... }`


## Best practices

#### CSS variables

New CSS var way. Usually, var are scoped in `:root` which mean global, and in the `web/src/pcss/vars-*.pcss`, like this. 

```css
:root{
  --color: blue;
}
a{
  color: var(--color);
}
```



## Tips


#### VSCode tips to migrate from SASS `$varName` >> CSS VAR (`--varName`)

Fist, in the files **var-*.pcss**, relpace all of the `$varName:` by `--varName`. This could easily done by a multi select of `$` and then type `--`.

Then, to change the usage, do the following: 

- Do a search (global or local to a file) and in the search box click on teh `.*` for regex,
- In the search input field, enter `\$(.*);`
- In the replace input field, type `var(--$1);`

This will change all fo the `$varName;` to `var(--varName);`
