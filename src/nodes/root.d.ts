import postcss from "postcss";
import { RootProps, RootRaws } from "postcss/lib/root";

interface StyleRaws extends RootRaws {
  stringType: '"' | "'" | "`";
}

interface StyleProps extends RootProps {
  raws: StyleRaws;
}

export declare class StyleRoot extends postcss.Root {
  raws: StyleRaws;
  constructor(options?: StyleProps);
}
