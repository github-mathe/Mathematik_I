jupyter-book build .
cp -r _build/html/* docs
git commit -a -m "update"
git push
